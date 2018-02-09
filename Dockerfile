#
# This Dockerfile starts with 'node:latest' (v9.x) image and installs Java 8 SDK and Maven into it.
# Many thanks to these excellent guides for inspiration:
#
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# https://github.com/kdvolder/docker-mvn-plus-npm/blob/master/Dockerfile
#

FROM node:latest
LABEL author="Sanjay Nagamangalam <sanagama2@gmail.com>"
LABEL version=1.0

# Install Java 8 SDK and Maven
RUN apt-get update && apt-get install -y \
  git \
  openjdk-8-jdk \
  maven \
  curl

ENV HOMEDIR=/app

# Create app directory for our Node app
WORKDIR $HOMEDIR

# Install Node dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Copy over the rest of the app sources
COPY . $HOMEDIR

# Compile .ts files
RUN npm run-script build

EXPOSE 8080

# Start Node app
#CMD [ "npm", "start" ]
CMD /bin/bash  
