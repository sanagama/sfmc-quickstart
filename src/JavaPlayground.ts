'use strict';

import express = require("express");
import path = require('path');
import Utils = require('./utils');
import shell = require('shelljs');
import https = require('https');
import * as childprocess from 'child_process';
var reCAPTCHA = require('recaptcha2');

export default class JavaPlayground
{
    private static _requestStatusMap = new Map<string, string>();
    
    constructor(app: express.Express)
    {
        this.initialize();
    }
    
    private initialize(): void
    {
    }
    
    /**
     * requestStatus: gets status message for session in 'req.session'
     * Handles GET on: /playgound-api/java/getstatus'
     */
    public getStatus(req: express.Request, res: express.Response)
    {
        var sessionId = req.session.id;
        Utils.logDebug("getStatus called. SessionId = " + sessionId);
        if(JavaPlayground._requestStatusMap.has(sessionId))
        {
            // send current status message for sessionId
            Utils.logDebug("getStatus: Status message found for SessionId = " + sessionId);
            res.send(JavaPlayground._requestStatusMap.get(sessionId))
        }
        else
        {
            // send 'Not Found'
            Utils.logDebug("getStatus: 404: No status message found for SessionId = " + sessionId);
            res.sendStatus(404);
        }
    }

    /**
     * clearStatus: deletes an existing project in session's playground directory and runs Maven to create a new project
     * Handles GET on: /playgound-api/java/clearstatus'
     */
    public clearStatus(req: express.Request, res: express.Response)
    {
        var sessionId = req.session.id;
        Utils.logDebug("clearStatus called. SessionId = " + sessionId);
        if(JavaPlayground._requestStatusMap.has(sessionId))
        {
            Utils.logDebug("clearStatus: Clearing status message found for SessionId = " + sessionId);
            JavaPlayground._requestStatusMap.delete(sessionId);
            res.sendStatus(200);
        }
        else
        {
            // send 'Not Found'
            Utils.logDebug("clearStatus: 404: No status message found for SessionId = " + sessionId);
            res.sendStatus(404);
        }
    }

    
    /**
     * createProject: runs Maven to create a new project for the given sessionId. Deletes an existing project first.
     * Handles GET on: /playgound-api/java/createproject'
     */
    public newProject(req: express.Request, res: express.Response)
    {
        var sessionId = req.session.id;
        Utils.logDebug("newProject called. SessionId = " + sessionId);

        // Set current status
        JavaPlayground._requestStatusMap.set(sessionId, "newProject: request received\n");

        // Get bash script to run + args
        var scriptToRun = path.join(__dirname,'../playground-scripts','java-new-project.sh');
        var pomXml = path.join(__dirname,'../static','code-snippets','java','mvn-pom.xml');

        // Run script async in a fork
        this.runShellScript(sessionId, scriptToRun, [sessionId, pomXml]);
        res.sendStatus(202); // accepted
    }

    /**
     * runApp1: runs the first simple Java app in the playground
     * Handles GET on: /playgound-api/java/runapp1
     */
    public runApp1(req: express.Request, res: express.Response)
    {
        var sessionId = req.session.id;
        Utils.logDebug("runApp1 called. SessionId = " + sessionId);

        // Set current status
        JavaPlayground._requestStatusMap.set(sessionId, "Run app: request received\n");
        
        // Get bash script to run + args
        var scriptToRun = path.join(__dirname,'../playground-scripts','java-run-project.sh');
        var appJava = path.join(__dirname,'../static','code-snippets','java','app1-playground.java');
        
        // Run script async in a fork
        this.runShellScript(sessionId, scriptToRun, [sessionId, appJava]);
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
        Utils.logDebug("runApp2 called. SessionId = " + sessionId);

        var recaptcha = new reCAPTCHA({
            siteKey: process.env.SFMC_PLAYGROUND_RECAPTCHA_SITEKEY,
            secretKey: process.env.SFMC_PLAYGROUND_RECAPTCHA_SECRET
        });

        // The code snippet below is based on: https://github.com/fereidani/recaptcha2
        recaptcha.validate(req.body['g-recaptcha-response'])
        .then(function() {
            // validated and secure
            Utils.logDebug("runApp2: CAPTCHA verified");

            // Set current status
            JavaPlayground._requestStatusMap.set(sessionId, "Run app: request received\n");
            
            // Get bash script to run + args
            var scriptToRun = path.join(__dirname,'../playground-scripts','java-run-project.sh');
            var appJava = path.join(__dirname,'../static','code-snippets','java','app2-playground.java');
            var emailAddress = req.body.inputEmail;
            
            // Run script async in a fork
            self.runShellScript(sessionId, scriptToRun, [sessionId, appJava, emailAddress]);
            res.sendStatus(202); // accepted
        })
        .catch(function(errorCodes: any) {
          // invalid
          res.send("[ERROR] " + recaptcha.translateErrors(errorCodes));
        });
    }
    
    /**
     * runShellScript: runs the specified shell script asychronously in a fork
     */
    private runShellScript(sessionId: string, scriptToRun: string, args: string[])
    {
        Utils.logDebug("runShellScript called. SessionId = " + sessionId);
        
        // run script async in a new process
        var child = childprocess.spawn(scriptToRun, args, {shell: true});

        child.stdout.on('data', function(data: any) {
            //Utils.logDebug("runShellScript: received data from shell script");

            let statusMessage = JavaPlayground._requestStatusMap.get(sessionId);
            statusMessage += data;
            JavaPlayground._requestStatusMap.set(sessionId, statusMessage);
        });

        child.on('close', function() {
            //Utils.logDebug("runShellScript: shell script exited");

            let statusMessage = JavaPlayground._requestStatusMap.get(sessionId);
            statusMessage += "\n[EXIT]: playground run complete";
            JavaPlayground._requestStatusMap.set(sessionId, statusMessage);
        });        
    }
}