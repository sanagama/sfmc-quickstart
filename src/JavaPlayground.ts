'use strict';

import express = require("express");
import path = require('path');
import Utils = require('./utils');
import shell = require('shelljs');
import https = require('https');
var reCAPTCHA = require('recaptcha2');


export default class JavaPlayground
{
    constructor(app: express.Express)
    {
        this.initialize();
    }
    
    private initialize(): void
    {
    }
    
    /**
     * createProject: deletes an existing project in session's playground directory and runs Maven to create a new project
     * Handles GET on: /playgound-api/java/createproject'
     */
    public createProject(req: express.Request, res: express.Response)
    {
        var sessionId = req.session.id;
        Utils.logDebug("createProject called. SessionId = " + sessionId);

        var scriptToRun = path.join(__dirname,'../playground-scripts','java-create-project.sh');
        var pomXml = path.join(__dirname,'../static','code-snippets','java','mvn-pom.xml');
        scriptToRun = scriptToRun + " " + sessionId + " " + pomXml;
        //Utils.logDebug("scriptToRun = " + scriptToRun);

        var responseText = shell.exec(scriptToRun).stdout; // sync call
        res.send(responseText);
    }

    /**
     * runApp1: runs the first simple Java app in the playground
     * Handles GET on: /playgound-api/java/runapp1
     */
    public runApp1(req: express.Request, res: express.Response)
    {
        var sessionId = req.session.id;
        Utils.logDebug("runApp1 called. SessionId = " + sessionId);

        var scriptToRun = path.join(__dirname,'../playground-scripts','java-run-project.sh');
        var appJava = path.join(__dirname,'../static','code-snippets','java','app1-playground.java');
        scriptToRun = scriptToRun + " " + sessionId + " " + appJava;
        
        //Utils.logDebug("scriptToRun = " + scriptToRun);
        var responseText = shell.exec(scriptToRun).stdout; // sync call
        res.send(responseText);
    }

    /**
     * runApp2: runs the second advanced Java app in the playground
     * Handles POST on: /playgound-api/java/runapp2
     */
    public runApp2(req: express.Request, res: express.Response)
    {
        var self = this;
        var responseText = "";
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

            var emailAddress = req.body.inputEmail;
            var scriptToRun = path.join(__dirname,'../playground-scripts','java-run-project.sh');
            var appJava = path.join(__dirname,'../static','code-snippets','java','app2-playground.java');
            scriptToRun = scriptToRun + " " + sessionId + " " + appJava + " " + emailAddress;

            Utils.logDebug("scriptToRun = " + scriptToRun);
            //responseText += shell.exec(scriptToRun).stdout;

            responseText += "sent e-mail";
            res.send(responseText);
        })
        .catch(function(errorCodes: any) {
          // invalid
          responseText = "** ERROR: CAPTCHA verification failed. No e-mail sent. Complete step 3.1 and try again.";
          res.send(responseText);
        });
    }
}