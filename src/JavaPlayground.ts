'use strict';

import express = require("express");
import path = require('path');
import Utils = require('./utils');
import shell = require('shelljs');

export default class JavaPlayground
{
    private _cmdCreateProject: string;

    constructor(app: express.Express)
    {
        Utils.logDebug("JavaPlayground c'tor called");
        this.initialize();
    }
    
    private initialize(): void
    {
        this._cmdCreateProject = 'mvn archetype:generate -B "-DgroupId=com.sfmcsamples" "-DartifactId=sfmc-java-sample" "-DarchetypeArtifactId=maven-archetype-quickstart" "-Dversion=1.0.0';
    }
    
    /**
     * createProject
     */
    public createProject(req: express.Request, res: express.Response)
    {
        Utils.logDebug("createProject called");
        var sessionId = req.session.id;
        Utils.logDebug("sessionId= " + sessionId);

        var { stdout, stderr, code } = shell.exec('mvn -v');
        var output = stdout;
        res.send(output);
    }

    /**
     * compileProject
     */
    public compileProject(req: express.Request, res: express.Response)
    {

    }

    /**
     * copyAppJava
     */
    public copyAppJava(req: express.Request, res: express.Response)
    {

    }

    /**
     * copyAppJava
     */
    public runApp(req: express.Request, res: express.Response)
    {

    }
}
 