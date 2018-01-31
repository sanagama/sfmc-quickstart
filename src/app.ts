import * as express from "express";
import * as compression from "compression";  // compresses requests
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as dotenv from "dotenv";
import * as path from "path";
import * as favicon from "serve-favicon";

// Routes
import * as homeRoute from "./routes/home";
import * as apiRoute from "./routes/api";
import * as sdkRoute from "./routes/sdk";

const PORT = process.env.PORT || 5000

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env" });

// Create Express server
const app = express();

// Express configuration
app.set("port", PORT);
app.set("views", path.join(__dirname, "../views"));
app.set('view engine', 'ejs');

app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));

app.use(favicon(path.join(__dirname,'static','images','favicons', 'favicon.ico')));

// Primary app routes.
app.get("/", homeRoute.index);
app.get("/api/rest", apiRoute.restPage1);
app.get("/api/rest2", apiRoute.restPage2);
app.get("/sdk/java", sdkRoute.javaPage1);
app.get("/sdk/java2", sdkRoute.javaPage2);
app.get("/sdk/java3", sdkRoute.javaPage3);

module.exports = app;