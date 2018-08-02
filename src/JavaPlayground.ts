'use strict';

import express = require("express");
import path = require('path');
import Utils = require('./utils');
import * as childprocess from 'child_process';
var reCAPTCHA = require('recaptcha2');

export default class JavaPlayground
{
    private static _requestStatusMap = new Map<string, string>();
    
    /**
     * requestStatus: gets status message for session in 'req.session'
     * Handles GET on: /playgound-api/java/statustext'
     */
    public getStatus(req: express.Request, res: express.Response)
    {
        var sessionId = req.session.id;
        Utils.logDebug("getStatus called. SessionId = " + sessionId);
        res.send(this.getStatusMessage(sessionId));
    }

    /**
     * clearStatus: deletes an existing project in session's playground directory and runs Maven to create a new project
     * Handles DELETE on: /playgound-api/java/statustext'
     */
    public clearStatus(req: express.Request, res: express.Response)
    {
        var sessionId = req.session.id;
        Utils.logDebug("clearStatus called. SessionId = " + sessionId);
        if(JavaPlayground._requestStatusMap.has(sessionId))
        {
            Utils.logDebug("clearStatus: Clearing status message for SessionId = " + sessionId);
            JavaPlayground._requestStatusMap.delete(sessionId);
        }
        else
        {
            // status not found
            Utils.logDebug("clearStatus: No status message found for SessionId = " + sessionId);
        }
        res.sendStatus(202); // accepted
    }
   
    /**
     * createProject: runs Maven to create a new project for the given sessionId. Deletes an existing project first.
     * Handles POST on: /playgound-api/java/createproject'
     */
    public newProject(req: express.Request, res: express.Response)
    {
        var self = this;
        var sessionId = req.session.id;

        // Set current status
        Utils.logDebug("newProject called. SessionId = " + sessionId);
        self.setStatusMessage(sessionId, "newProject: request received\n");

        // Get bash script to run + args
        var scriptToRun = path.join(__dirname,'../playground-scripts','java-new-project.sh');
        var pomXml = path.join(__dirname,'../static','code-snippets','java','mvn-pom.xml');

        // Run script async in a fork
        self.runShellScript(sessionId, scriptToRun, [sessionId, pomXml]);
        res.sendStatus(202); // accepted
    }

    /**
     * runApp1: runs the first simple Java app in the playground
     * Handles POST on: /playgound-api/java/runapp1
     */
    public runApp1(req: express.Request, res: express.Response)
    {
        var self = this;
        var sessionId = req.session.id;

        // Set current status
        Utils.logDebug("runApp1 called. SessionId = " + sessionId);
        self.setStatusMessage(sessionId, "Run app: request received\n");
        
        // Get bash script to run + args
        var scriptToRun = path.join(__dirname,'../playground-scripts','java-run-project.sh');
        var appJava = path.join(__dirname,'../static','code-snippets','java','app1-playground.java');
        
        // Run script async in a fork
        self.runShellScript(sessionId, scriptToRun, [sessionId, appJava]);
        res.sendStatus(202); // accepted
    }

    /**
     * runApp2: runs the second advanced Java app in the playground
     * Handles POST on: /playgound-api/java/runapp2
     */
    public runApp2(req: express.Request, res: express.Response)
    {
        var self = this;
        var sessionId = req.session.id;

        // Set current status
        Utils.logDebug("runApp2 called. SessionId = " + sessionId);
        self.setStatusMessage(sessionId, "Run app: request received\n");
        
        // Verify CAPTCHA
        self.verifyCaptcha(req, res)
        .then((result) => {
            // Get bash script to run + args
            var scriptToRun = path.join(__dirname,'../playground-scripts','java-run-project.sh');
            var appJava = path.join(__dirname,'../static','code-snippets','java','app2-playground.java');
            var emailAddress = req.body.inputEmail;
            
            // Run script async in a fork
            self.runShellScript(sessionId, scriptToRun, [sessionId, appJava, emailAddress]);
        })
        .catch((err) => {
            Utils.logDebug("verifyCaptcha failed. Error: " + err);
        });
    
        res.sendStatus(202); // accepted
    }

    /**
     * verifyCaptcha: uses Google APIs to verify CAPTCHA
     * The code snippet below is based on: https://github.com/fereidani/recaptcha2
     */
    private verifyCaptcha(req: express.Request, res: express.Response) : Promise<any>
    {
        var self = this;
        var sessionId = req.session.id;
        Utils.logDebug("verifyCaptcha called. SessionId = " + sessionId);

        return new Promise<any>((resolve, reject) =>
        {
            self.appendToStatusMessage(sessionId, "Verifying CAPTCHA\n");

            var recaptcha = new reCAPTCHA({
                siteKey: process.env.SFMC_PLAYGROUND_RECAPTCHA_SITEKEY,
                secretKey: process.env.SFMC_PLAYGROUND_RECAPTCHA_SECRET
            });
    
            recaptcha.validate(req.body['g-recaptcha-response'])
            .then((result: any) => {
                // CAPTCHA verified
                Utils.logDebug("verifyCaptcha: CAPTCHA verified. SessionId = " + sessionId);
                self.appendToStatusMessage(sessionId, "CAPTCHA verified\n");
                resolve(true);
            })
            .catch((errorCode: any) => {
              // CAPTCHA invalid
              self.appendToStatusMessage(sessionId, "[ERROR] Please complete Step 3.1: Pass CAPTCHA check." );
              reject(errorCode);
            });
        });
    }
    
   /**
     * appendToStatusMessage: appends the given message to status for the given sessionId
     */
    private appendToStatusMessage(sessionId: string, newMessage: string)
    {
        var message = this.getStatusMessage(sessionId) + newMessage;
        this.setStatusMessage(sessionId, message);
    }

    /**
     * getStatusMessage: appends the given message to status for the given sessionId
     */
    private getStatusMessage(sessionId: string): string
    {
        if(JavaPlayground._requestStatusMap.has(sessionId))
        {
            // send current status message for sessionId
            return JavaPlayground._requestStatusMap.get(sessionId);
        }
        else
        {
            // send back an empty string
            Utils.logDebug("getStatusMessage: No status message found for SessionId = " + sessionId);
            return "";
        }
    }
    
    /**
     * setStatusMessage: sets the given message to status for the given sessionId
     */
    private setStatusMessage(sessionId: string, message: string)
    {
        JavaPlayground._requestStatusMap.set(sessionId, message);
    }

    /**
     * runShellScript: runs the specified shell script asychronously in a fork
     */
    private runShellScript(sessionId: string, scriptToRun: string, args: string[])
    {
        var self = this;
        Utils.logDebug("runShellScript called. SessionId = " + sessionId);
        
        // run script async in a new process
        var child = childprocess.spawn(scriptToRun, args, {shell: true});

        child.stdout.on('data', function(data: any) {
            self.appendToStatusMessage(sessionId, data);
        });

        child.on('close', function() {
            self.appendToStatusMessage(sessionId, "\n[EXIT]: playground run complete");
        });        
    }
}