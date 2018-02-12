#
# This Dockerfile starts with 'node:latest' (v9.x) image and installs Java 8 SDK and Maven into it.
# Many thanks to these excellent guides for inspiration:
#
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# https://github.com/kdvolder/docker-mvn-plus-npm/blob/master/Dockerfile
#

FROM maven:3-jdk-8
LABEL author="Sanjay Nagamangalam <sanagama2@gmail.com>"
LABEL version=1.0

# Install Node.js 9.x
RUN apt-get update && apt-get install -y apt-utils && \
  curl -sL https://deb.nodesource.com/setup_9.x | bash && \
  apt-get update && apt-get install -y nodejs

ENV HOMEDIR=/app

# Create app directory for our Node app
WORKDIR $HOMEDIR

# Copy over app sources
COPY . $HOMEDIR

# Install Node dependencies (also complies .ts files)
RUN npm install
RUN npm run-script build

EXPOSE 8080

# Start Node app
CMD [ "npm", "start" ]
#CMD /bin/bash
