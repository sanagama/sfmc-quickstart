## Send - Email Addr
curl -X "POST" "https://www-qa1.exacttargetapis.com/transactionalmessages/v1/email/definition/mydefinition/send" \
     -d $'{
        "to": [
          {
            "subscriberKey": "allen.hoem.sf1234",
            "emailAddress": "allen.hoem.sf@gmail.com",
            "messageKey": "0376dff6-6256-4344-961b-91ef8fbc2a41"
          }
        ]
      }' \
     -H 'Content-Type: application/json' \
     -H 'Authorization: Bearer --your-token--' 