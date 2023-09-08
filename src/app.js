require("dotenv").config();
//insert package
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

//init db
require("./dbs/init.mongodb");
// //check overload request
// const { checkOverload } = require("./helpers/check.connect");
// checkOverload();

//init routers
app.use("/", require("./routers"));

//handling errors

module.exports = app;
