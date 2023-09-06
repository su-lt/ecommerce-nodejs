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
//init db
require("./dbs/init.mongodb");
// //check overload request
// const { checkOverload } = require("./helpers/check.connect");
// checkOverload();
//init routes
app.get("/", (req, res, next) => {
    return res.status(200).json({
        message: "Welcome",
    });
});
//handling errors

module.exports = app;
