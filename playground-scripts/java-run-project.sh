#!/bin/bash

# Compiles and runs Maven project
# Parameter $1 (required) = sessionId - determines the project directory
# Parameter $2 (required) = path to source App.java file
# Parameter $3 (optional) = e-mail address of receipient

if [ -z "$1" ]
then
    echo "[ERROR] Insufficient arguments - Exiting. Please provide a unique string (e.g. sessionId or Guid) as the first argument."
    echo "This argument is used to determine the root directory of the Maven project in the playground."
    exit 1
fi

if [ -z "$2" ]
then
    echo "[ERROR] Insufficient arguments - Exiting. Please provide the path to the source App.java file as the second argument."
    echo "This argument is used when compiling the Maven project in the playground."
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
    echo "[ERROR] A project doesn't exist in the playground for this session."
    echo "Please complete Step #1 to create a Maven project and come back here."
    exit 1
fi

# Copy over App.Java to project direcvtory
echo "Copying App.java to project directory"
cp $sourceAppJava $projectPath/src/main/java/com/sfmcsamples/App.java

cd $projectPath
#echo "Current directory = " `pwd`

# replace: "-- receipient e-mail address --" with $sendToEmailAddress
if [ -n "$sendToEmailAddress" ]
then
    echo "Updating receipient's e-mail address in App.Java to: " $sendToEmailAddress
    stringToReplace="-- receipient e-mail address --"
    sed -i -e "s/$stringToReplace/$sendToEmailAddress/g" $projectPath/src/main/java/com/sfmcsamples/App.java
fi

# Compile Maven project
echo "Compiling Maven project in playground..."
mvn -q clean package
retVal=$?

if [ $retVal -eq 0 ]; then
    echo "Successfully compiled Maven project"
    echo $projectPath
else
    echo "[ERROR] An error occurred while compiling the project. Please reload this page and try again."
    exit $retVal
fi

# Run Maven project
echo "Running Java app in playground..."
mvn -q exec:java "-Dexec.mainClass=com.sfmcsamples.App"
retVal=$?

if [ $retVal -eq 0 ]; then
    echo ""
    echo "Successfully ran Java app in playground"
    echo $projectPath
else
    echo "[ERROR] An error occurred while running the Java app. Please reload this page and truy again."
fi

exit $retVal
