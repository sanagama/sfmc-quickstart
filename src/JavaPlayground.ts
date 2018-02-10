'use strict';

import express = require("express");
import path = require('path');
import Utils = require('./utils');
import shell = require('shelljs');
var async = require("async");

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
     */
    public createProject(req: express.Request, res: express.Response)
    {
        var responseText = "";
        var sessionId = req.session.id;
        Utils.logDebug("createProject called. SessionId = " + sessionId);

        var scriptToRun = path.join(__dirname,'static','playground','java-create-project.sh');
        var pomXml = path.join(__dirname,'static','code-snippets','java','mvn-pom.xml');
        scriptToRun = scriptToRun + " " + sessionId + " " + pomXml;
        //Utils.logDebug("scriptToRun = " + scriptToRun);

        var { stdout, stderr, code } = shell.exec(scriptToRun);
        if(code !== 0)
        {
            responseText += stderr;
        }
        else
        {
            responseText += stdout;
        }
        res.send(responseText);
    }

    /**
     * runApp1: runs the first Java app in the playground
     */
    public runApp1(req: express.Request, res: express.Response)
    {
        var responseText = "";
        var sessionId = req.session.id;
        Utils.logDebug("runApp1 called. SessionId = " + sessionId);

        var scriptToRun = path.join(__dirname,'static','playground','java-run-project.sh');
        var appJava = path.join(__dirname,'static','code-snippets','java','app1-playground.java');
        scriptToRun = scriptToRun + " " + sessionId + " " + appJava;
        
        //Utils.logDebug("scriptToRun = " + scriptToRun);

        responseText += shell.exec(scriptToRun).stdout;
        res.send(responseText);
    }

    /**
     * runApp2: runs the second Java app in the playground
     */
    public runApp2(req: express.Request, res: express.Response)
    {
        var responseText = "";
        var sessionId = req.session.id;
        Utils.logDebug("runApp2 called. SessionId = " + sessionId);

        var scriptToRun = path.join(__dirname,'static','playground','java-run-project.sh');
        var appJava = path.join(__dirname,'static','code-snippets','java','app2-playground.java');
        scriptToRun = scriptToRun + " " + sessionId + " " + appJava;
        
        //Utils.logDebug("scriptToRun = " + scriptToRun);

        responseText += shell.exec(scriptToRun).stdout;
        res.send(responseText);
    }
}
 