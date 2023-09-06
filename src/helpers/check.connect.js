"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
//variable
const _SECONDS = 5000;

//count connections
const countConnect = () => {
    const numConnections = mongoose.connections.length;
    console.log(`Number of connections: ${numConnections}`);

    return numConnections;
};

//check overload
const checkOverload = () => {
    setInterval(() => {
        const numConnections = countConnect();
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        //example maximun number of connections based on number of cores
        const maxConnections = numCores * 5;

        console.log(`Active connections: ${numConnections}`);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

        if (numConnections > maxConnections) {
            console.log("Connection overload detected !!!");
        }
    }, _SECONDS); // monitor every 5 second
};

module.exports = {
    countConnect,
    checkOverload,
};
