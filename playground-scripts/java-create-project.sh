#!/bin/bash

# Creates playground path and new Maven project
# Parameter $1 = sessionId <required>
# Parameter $2 = path to source pom.xml file

if [ -z "$1" ]
then
    echo "[ERROR] Insufficient arguments passed - Exiting. Please supply a unique string (e.g. sessionId) for the project directory as the first parameter."
    exit 1
fi

if [ -z "$2" ]
then
    echo "[ERROR] Insufficient arguments passed - Exiting. Please supply the path to the source pom.xml file as the second parameter."
    exit 1
fi

sessionId=$1
sourcePomXml=$2
projectName="sfmc-java-sample"
mvnGroupId="com.sfmcsamples"
playgroundPath=$HOME/playground
sessionPlaygroundPath=$playgroundPath/$sessionId
projectPath=$sessionPlaygroundPath/$projectName

#echo "SessionId: " $sessionId
#echo "SourcePomXml: " $sourcePomXml
#echo "PlaygroundPath: " $playgroundPath
#echo "SessionPlaygroundPath: " $sessionPlaygroundPath
#echo "ProjectPath: " $projectPath

# Delete project directory for this session if it exists
if [ -d $sessionPlaygroundPath ]
then
    #echo "Session playground directory exists: " $sessionPlaygroundPath
    #echo "Deleting it and starting fresh"
    rm -fr $sessionPlaygroundPath
fi

#echo "Creating session playground directory: " $sessionPlaygroundPath
mkdir -p $sessionPlaygroundPath
cd $sessionPlaygroundPath

# Create Maven project
#echo "Creating Maven project in: " $sessionPlaygroundPath
mvn -q archetype:generate -B "-DgroupId=com.sfmcsamples" "-DartifactId=sfmc-java-sample" "-DarchetypeArtifactId=maven-archetype-quickstart" "-Dversion=1.0.0"
retVal=$?

if [ $retVal -eq 0 ]; then
    echo "Successfully created Apache Maven project in the playground at:"
    echo $projectPath
else
    echo "[ERROR] An error occurred while creating Maven project in the playground. Please reload this page and try again."
    exit $retVal
fi

# Copy pom.xml to project directory
#echo "Copying pom.xml to project directory"
cp $sourcePomXml $projectPath/pom.xml
retVal=$?

if [ $retVal -eq 0 ]; then
    echo "Successfully copied pom.xml to Apache Maven project"
else
    echo "[ERROR] An error occurred while copying pom.xml to Apache Maven project. Please reload this page and try again."
fi

exit $retVal
