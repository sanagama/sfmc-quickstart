## Upgrade TSD
curl -X "PATCH" "https://www-qa1.exacttargetapis.com/transactionalmessages/v1/email/definition/mydefinition" \
     -d $'{}' \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer --your-token--'