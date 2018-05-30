#!/bin/bash

set -x

docker rmi -f allenhoem/sfmc-quickstart
#docker rmi -f registry.heroku.com/sfmc-quickstart/web

docker build . -t allenhoem/sfmc-quickstart
docker images

# Test locally with the command below:
#
# docker run  -it --name 'sfmc-quickstart' 
# -e 'SFMC_PLAYGROUND_CLIENTID=<CLIENTID>' \
# -e 'SFMC_PLAYGROUND_CLIENTSECRET=<CLIENTSECRET>' \
# -e 'SFMC_PLAYGROUND_RECAPTCHA_SECRET=<SECRET>' \
# -e 'SFMC_PLAYGROUND_RECAPTCHA_SITEKEY=<SITEKEY>' -p 5000:5000 sanagama/sfmc-quickstart
#

# Publish to Dockerhub with the command below:
# docker push sanagama/sfmc-quickstart

# Publish to Heroku
# Details here: https://blog.devcenter.co/deploy-asp-net-core-2-0-apps-on-heroku-eea8efd918b6

# heroku login
# heroku container:login
# docker tag sanagama/sfmc-quickstart registry.heroku.com/sfmc-quickstart/web
# docker push registry.heroku.com/sfmc-quickstart/web
