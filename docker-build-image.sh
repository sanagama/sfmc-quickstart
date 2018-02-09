#!/bin/bash

set -x

docker build -t . sanagama/sfmc-quickstart
docker images

# docker push sanagama/sfmc-quickstart2

# See: https://blog.devcenter.co/deploy-asp-net-core-2-0-apps-on-heroku-eea8efd918b6

# heroku login
# heroku container:login

# docker tag sanagama/sfmc-quickstart2 registry.heroku.com/sfmc-quickstart-services/web
# docker push registry.heroku.com/sfmc-quickstart2/web
