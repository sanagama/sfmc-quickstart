#!/bin/bash

# Compiles and runs Maven project
# Parameter $1 = sessionId <required>
# Parameter $2 = path to source App.java file

if [ -z "$1" ]
then
    echo "** Insufficient arguments passed - Exiting. Please supply a unique string (e.g. sessionId) for the project directory as the first parameter."
    exit 1
fi

if [ -z "$2" ]
then
    echo "** Insufficient arguments passed - Exiting. Please supply the path to the source App.java file as the second parameter."
    exit 1
fi

sessionId=$1
sourceAppJava=$2
projectName="sfmc-java-sample"
mvnGroupId="com.sfmcsamples"
playgroundPath=$HOME/playground
sessionPlaygroundPath=$playgroundPath/$sessionId
projectPath=$sessionPlaygroundPath/$projectName

#echo "SessionId: " $sessionId
#echo "SourceAppJava: " $sourceAppJava
#echo "PlaygroundPath: " $playgroundPath
#echo "SessionPlaygroundPath: " $sessionPlaygroundPath
#echo "ProjectPath: " $projectPath

# Proceed only if the project directory exists
if [ ! -d $sessionPlaygroundPath ]
then
    echo "Error: Session playground project doesn't exist: " $sessionPlaygroundPath
    echo "Please complete Step #1 to create a Maven project and come back here."
    exit 1
fi

# Copy over App.Java
#echo "Copying App.java to project directory"
cp $sourceAppJava $projectPath/src/main/java/com/sfmcsamples/App.java

cd $projectPath
#echo "Current directory = " `pwd`

# Compile Maven project
#echo "Compiling app..."
mvn -q clean package

retVal=$?
if [ $? -eq 0 ]; then
    echo "Successfully compiled Java Maven project in playground at:" $projectPath

    echo "Running app in playground..."
    mvn -q exec:java "-Dexec.mainClass=com.sfmcsamples.App"
fi
exit $retVal
