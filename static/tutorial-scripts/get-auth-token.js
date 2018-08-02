"use strict";
exports.__esModule = true;
var http = require("http");
var baseURL = "https://auth-qa.exacttargetapis.com";
function getAuth() {
    var ID = "" + Math.floor(Math.random() * 1000) + 2000;
    var payload = JSON.stringify({ clientId: "konpqs7nhmv5hfwp9blza3z0", clientSecret: "ez6JfXNPbBSzDVuAiCLSruQj" });
    var params = { headers: { "Content-Type": "application/json" } };
    var info = http.post(baseURL + "/v1/requesttoken", payload, params).body;
    var myAuthToken = JSON.parse(info).accessToken;
    params = { headers: { "Content-Type": "application/json", "Authorization": "Bearer " + myAuthToken } };
    http.patch("https://www-qa1.exacttargetapis.com/transactionalmessages/v1/email/definition/NewRouteTest", "", params);
}
