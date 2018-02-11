#!/bin/bash

# Compiles and runs Maven project
# Parameter $1 (required) = sessionId <required>
# Parameter $2 (required) = path to source App.java file
# Parameter $3 (optional) = e-mail address of receipient

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
sendToEmailAddress=$3
projectName="sfmc-java-sample"
mvnGroupId="com.sfmcsamples"
playgroundPath=$HOME/playground
sessionPlaygroundPath=$playgroundPath/$sessionId
projectPath=$sessionPlaygroundPath/$projectName

#echo "SessionId: " $sessionId
#echo "SourceAppJava: " $sourceAppJava
#echo "SendToEmailAddress: " $sendToEmailAddress
#echo "PlaygroundPath: " $playgroundPath
#echo "SessionPlaygroundPath: " $sessionPlaygroundPath
#echo "ProjectPath: " $projectPath

# Proceed only if the project directory exists
if [ ! -d $sessionPlaygroundPath ]
then
    echo "** Error: A project doesn't exist in the playground for this session."
    echo "Please complete Step #1 to create a Maven project and come back here."
    exit 1
fi

# Copy over App.Java to project direcvtory
#echo "Copying App.java to project directory"
cp $sourceAppJava $projectPath/src/main/java/com/sfmcsamples/App.java

cd $projectPath
#echo "Current directory = " `pwd`

# replace: "-- receipient e-mail address --" with $sendToEmailAddress
#echo "Updating receipient's e-mail address in App.Java
if [ -n "$sendToEmailAddress" ]
then
    stringToReplace="-- receipient e-mail address --"
    sed -i -e "s/$stringToReplace/$sendToEmailAddress/g" $projectPath/src/main/java/com/sfmcsamples/App.java
fi

# Compile Maven project
#echo "Compiling app in playground..."
mvn -q clean package
retVal=$?

if [ $retVal -eq 0 ]; then
    echo "Successfully compiled Java Maven project in playground"
    echo $projectPath
else
    echo "** Error: An error occurred while compiling the project. Please reload this page and try again."
    exit $retVal
fi

# Run Maven project
#echo "Running app in playground..."
mvn -q exec:java "-Dexec.mainClass=com.sfmcsamples.App"
retVal=$?

if [ $retVal -eq 0 ]; then
    echo ""
    echo "Successfully ran Java Maven project in playground"
    echo $projectPath
else
    echo "** Error: An error occurred while running the project. Please reload this page and truy again."
    exit $retVal
fi

exit $retVal
