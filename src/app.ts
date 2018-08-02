import * as express from "express";
import * as compression from "compression";  // compresses requests
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as path from "path";
import * as favicon from "serve-favicon";
import * as session from "express-session";
import JavaPlayground from './JavaPlayground';
var request = require("request");
var http = require("http");

const PORT = process.env.PORT || 5000

// Create Express server
const app = express();

// Express configuration
app.set("port", PORT);
app.set("views", path.join(__dirname, "../views"));
app.set('view engine', 'ejs');

// Use helmet
// See this for more info: https://expressjs.com/en/advanced/best-practice-security.html
var helmet = require('helmet')
app.use(helmet());

app.use(session({
    name: 'server-session-cookie-id',
    secret: 'sanagama copper',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../static")));
app.use(express.static(path.join(__dirname, 'tutorial-scripts')));
app.use(favicon(path.join(__dirname,'../static','images','favicons', 'favicon.ico')));

//
// Only allow access to IPs in 'SFMC_PLAYGROUND_VALID_IPS' environment variable if present.
// Allow access to all IPs if 'SFMC_PLAYGROUND_VALID_IPS' environment variable is empty or undefined.
//
const CIDRRange = require('cidr-range'); //converter CIDR(s)
var IPWhiteList = new Array<String>();
if (app.get('env') === 'production') // heroku boots the app as production
{
    app.disable('x-powered-by');
    app.disable('server');

    let valid_ips = process.env.SFMC_PLAYGROUND_VALID_IPS;
    if(valid_ips)
    {
        const CIDRs = valid_ips.split(',');
        CIDRs.forEach(function(e)
        {
            if(e.indexOf('/') > -1)
            {
                //this is a CIDR
                IPWhiteList = IPWhiteList.concat(CIDRRange(e));
            }
            else
            {
                //it's a straight IP
                IPWhiteList.push(e);
            }
        });
    }
    // console.log("IP Whitelist = " + IPWhiteList.toString());

    app.enable('trust-proxy');
    app.set('trust-proxy', function(ip: string)
    {
        const address = ip;
        if(!IPWhiteList.length)
        {
            return true;    // Allow access to all IPs if IP Whitelist is empty
        }
        else
        {
            return (IPWhiteList.indexOf(address) > -1 ? true : false);
        }
    });

    app.all('*', function(req, res, next)
    {
        const host = (req.headers['x-forwarded-port'] === '443' ? ('https://' + req.headers.host) : false);
        const ip = req.headers['x-forwarded-for'];
        
        if (!host || process.env.appURL !== host)
        {
            const allow = req.app.get('trust-proxy')(ip);
            if (!allow)
            {
                console.log("** Access denied from IP: " + ip + ", host: " + host);
                res.status(401).render("401");  // unauthorized'
            }
            else
            {
                next();
            }
        }
        else
        {
            next();
        }
    });
}

// Routes: Home page
app.get('/', function(req, res) { res.render("home"); });

// Routes: Tutorials
app.get('/tutorials/transactional', function(req, res) { res.render("tutorials/transactional/quickstart_txn_def_email"); });
app.get('/tutorials/transactional/quickstart_txn_def_email-2', function (req, res) { res.render("tutorials/transactional/quickstart_txn_def_email-2"); });
app.get('/tutorials/transactional/quickstart_txn_def_email-3', function (req, res) { res.render("tutorials/transactional/quickstart_txn_def_email-3"); });
app.get('./tutorial-scripts/get-auth-token.ts', function(req, res) { res.sendFile('get-auth-token.ts'); });

// Routes: Java quickstart pages
app.get('/sdks/java/macos', function(req, res) { res.render("sdks/java/macos/java-mac-1"); });
app.get('/sdks/java/macos/java-mac-2', function(req, res) { res.render("sdks/java/macos/java-mac-2"); });
app.get('/sdks/java/macos/java-mac-3', function(req, res) { res.render("sdks/java/macos/java-mac-3"); });
//TBD: app.get('/sdks/java/windows', function(req, res) { res.render("sdks/java/windows/java-windows-1"); });

// Routes: Java playground pages
app.get('/playgrounds/java', function(req, res) { res.render("playgrounds/java/java-play-1"); });
app.get('/playgrounds/java/java-play-2', function(req, res) { res.render("playgrounds/java/java-play-2"); });
app.get('/playgrounds/java/java-play-3', function(req, res) { res.render("playgrounds/java/java-play-3"); });


// Routes: Java playground REST API
const javaPlayground = new JavaPlayground();

app.get('/playgound-api/java/statustext', function(req, res) {
    javaPlayground.getStatus(req, res); });

app.delete('/playgound-api/java/statustext', function(req, res) {
    javaPlayground.clearStatus(req, res); });
        
app.post('/playgound-api/java/newproject', function(req, res) {
    javaPlayground.newProject(req, res); });

app.post('/playgound-api/java/runapp1', function(req, res) {
    javaPlayground.runApp1(req, res); });
    
app.post('/playgound-api/java/runapp2', function(req, res) {
    javaPlayground.runApp2(req, res); });

//app.post('tutorial-scripts/get-auth-token', )
// attempting to POST to get OAuth key

app.post('/getauth', function(req, res){
    var oAuth = '';
    request.post('https://auth-qa.exacttargetapis.com/v1/requesttoken',
                {json: {clientId: req.body.clientId, clientSecret: req.body.clientSecret}},
                function(error, response, body) {
                    if(!error && response.statusCode == 200) {
                        res.send(body.accessToken);
                    }
                }
                );

    });

// PATCH route
app.post('/patch', function(req, res) {
    var token = req.body.authToken;
    var key = req.body.externalKey;
    var payload = JSON.stringify({name: "New Route Test", contentId: "3cb82d6a-d54b-4ba3-8ba3-76a138ee819c", description: "Testing your triggered send!"});
    request.patch({url: "https://www-qa1.exacttargetapis.com/transactionalmessages/v1/email/definition/" + key,
                    headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
                    body: payload}, function(error, response, body){ res.send(body); });
});

    // POST to complete triggered send
    app.post('/send', function(req, res) {
        var payload = JSON.stringify({
            to: [
                  {
                    emailAddress: req.body.to[0].emailAddress,
                    messageKey: req.body.to[0].messageKey,
                    subscriberKey: req.body.to[0].subscriberKey,
                    attributes: {
                        SubAttrName1: "SubAttrValue1"
                    }
                  }
                ],
                attributes: {
                    ReqAttrName1: "ReqAttrValue1"
                }
            });
        request.post({url:'https://www-qa1.exacttargetapis.com/transactionalmessages/v1/email/definition/' + req.body.to[0].definitionKey + '/send',
                    body: payload,
                    headers: {'Authorization': 'Bearer ' + req.body.to[0].accessToken, 'Content-Type': 'application/json'}},
                    function(error, response, body) {
                        //res.send(response);
                        if(!error && response.statusCode == 202) {
                            res.send(body);
                        }
                        else {
                            res.send(body);
                        } 
                    } 
        );//.auth(null, null, true, req.body.to[0].accessToken);
    });
module.exports = app;