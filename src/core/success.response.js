"use strict";

const StatusCode = require("../helpers/statusCodes");
const ReasonStatusCode = require("../helpers/reasonPhrases");

class SuccessResponse {
    constructor({
        message,
        statusCode = StatusCode.OK,
        responseStatusCode = ReasonStatusCode.OK,
        metadata = {},
    }) {
        this.message = !message ? responseStatusCode.message : message;
        this.status = statusCode;
        this.metadata = metadata;
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
    }
}

class CREATED extends SuccessResponse {
    constructor({
        message,
        statusCode = StatusCode.CREATED,
        responseStatusCode = ReasonStatusCode.CREATED,
        metadata,
        options = {},
    }) {
        super({ message, statusCode, responseStatusCode, metadata });
        this.options = options;
    }
}

module.exports = {
    OK,
    CREATED,
};
