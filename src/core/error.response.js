"use strict";

const StatusCode = require("../helpers/statusCodes");
const ReasonStatusCode = require("../helpers/reasonPhrases");

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(
        message = ReasonStatusCode.FORBIDDEN,
        statusCode = StatusCode.FORBIDDEN
    ) {
        super(message, statusCode);
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(
        message = ReasonStatusCode.CONFLICT,
        statusCode = StatusCode.CONFLICT
    ) {
        super(message, statusCode);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(
        message = ReasonStatusCode.BAD_REQUEST,
        statusCode = StatusCode.BAD_REQUEST
    ) {
        super(message, statusCode);
    }
}

class CreateDatabaseError extends ErrorResponse {
    constructor(
        message = ReasonStatusCode.NOT_FOUND,
        statusCode = StatusCode.NOT_FOUND
    ) {
        super(message, statusCode);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(
        message = ReasonStatusCode.UNAUTHORIZED,
        statusCode = StatusCode.UNAUTHORIZED
    ) {
        super(message, statusCode);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(
        message = ReasonStatusCode.NOT_FOUND,
        statusCode = StatusCode.NOT_FOUND
    ) {
        super(message, statusCode);
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    CreateDatabaseError,
    ForbiddenError,
    AuthFailureError,
    NotFoundError,
};
