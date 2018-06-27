## Upgrade TSD
curl -X "PATCH" "https://www.exacttargetapis.com/transactionalmessages/v1/email/definition/{definitionKey}" \
     -d $'{}' \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer --your-token--'