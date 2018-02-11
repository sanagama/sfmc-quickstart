'use strict';

import express = require("express");
import path = require('path');
import Utils = require('./utils');
import shell = require('shelljs');
import request = require('request');

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

        var responseText = shell.exec(scriptToRun).stdout;
        res.send(responseText);
    }

    /**
     * runApp1: runs the first Java app in the playground
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
        var responseText = shell.exec(scriptToRun).stdout;
        res.send(responseText);
    }

    /**
     * runApp2: runs the second Java app in the playground
     * Handles POST on: /playgound-api/java/runapp2
     */
    public runApp2(req: express.Request, res: express.Response)
    {
        var responseText = "";
        var sessionId = req.session.id;
        Utils.logDebug("runApp2 called. SessionId = " + sessionId);

        if(this.verifyCaptcha(req))
        {
            Utils.logDebug("runApp2: CAPTCHA verified");
            
            var emailAddress = req.body.inputEmail;
            if(this.validateEmailAddress(emailAddress))
            {
                Utils.logDebug("runApp2: e-mail address appears valid: " + emailAddress);

                var scriptToRun = path.join(__dirname,'../playground-scripts','java-run-project.sh');
                var appJava = path.join(__dirname,'../static','code-snippets','java','app2-playground.java');
                scriptToRun = scriptToRun + " " + sessionId + " " + appJava + " " + emailAddress;

                Utils.logDebug("scriptToRun = " + scriptToRun);
                //responseText = shell.exec(scriptToRun).stdout;
            }
            else
            {
                responseText = "** ERROR: " + "'" + emailAddress + "'" + 
                                " doesn't appear to be a valid e-mail address. No e-mail sent. Enter a valid e-mail address for the receipient.";
            }
        }
        else
        {
            responseText = "** ERROR: CAPTCHA verification failed. No e-mail sent. Refresh this page in your browser and try again.";
        }

        res.send(responseText);
    }

    //
    // Code snippet below is based on: https://developers.google.com/recaptcha/docs/verify
    //
    private verifyCaptcha(req: express.Request): boolean
    {
        Utils.logDebug("verifyCaptcha: called");
        
        let gRecaptchaResponse = req.body['g-recaptcha-response'];
        Utils.logDebug("gRecaptchaResponse: " + gRecaptchaResponse);
        if(gRecaptchaResponse === undefined || gRecaptchaResponse === '' || gRecaptchaResponse === null)
        {
            return false;
        }
        
        request.post({
            uri: "https://www.google.com/recaptcha/api/siteverify",
            form:
            {
                secret: process.env.RECAPTCHA_SECRET, // read from environment
                response: gRecaptchaResponse,
                remoteip : req.connection.remoteAddress
            }
        }, function(error, response, body) {

            body = JSON.parse(body);
            Utils.logDebug("verifyCaptcha: return body" + JSON.stringify(body));
            Utils.logDebug("verifyCaptcha: body.success" + JSON.stringify(body.success) + " " + body.success);

            if(body.success !== undefined && !body.success) {
                return false;
            }
            return true;
        });
    }

    //
    // Code snippet below is based on:
    // https://stackoverflow.com/questions/46155/how-can-an-email-address-be-validated-in-javascript
    // https://stackoverflow.com/questions/16648679/regexp-in-typescript
    //
    private validateEmailAddress(emailAddress: string): boolean
    {
        Utils.logDebug("validateEmailAddress called for: '" + emailAddress + "'");
        
        let regExp = new RegExp( "/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/");
        return(regExp.test(emailAddress));
    }
}