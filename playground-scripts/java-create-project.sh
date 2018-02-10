#!/bin/bash

# Creates playground path and new Maven project
# Parameter $1 = sessionId <required>
# Parameter $2 = path to source pom.xml file

if [ -z "$1" ]
then
    echo "** Insufficient arguments passed - Exiting. Please supply a unique string (e.g. sessionId) for the project directory as the first parameter."
    exit 1
fi

if [ -z "$2" ]
then
    echo "** Insufficient arguments passed - Exiting. Please supply the path to the source pom.xml file as the second parameter."
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

#echo "Creating Maven project in: " $sessionPlaygroundPath
cd $sessionPlaygroundPath
#echo "Current directory = " `pwd`

# Create Maven project
mvn -q archetype:generate -B "-DgroupId=com.sfmcsamples" "-DartifactId=sfmc-java-sample" "-DarchetypeArtifactId=maven-archetype-quickstart" "-Dversion=1.0.0"

# Copy over pom.xml
retVal=$?
if [ $? -eq 0 ]; then
    #echo "Copying pom.xml to project directory"
    cp $sourcePomXml $projectPath/pom.xml
    echo "Successfully created Apache Maven project in the playground at:"
    echo $projectPath
fi
exit $retVal
