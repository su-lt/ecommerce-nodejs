"use strict";

const { ForbiddenError } = require("../core/error.response");
const { findById } = require("../services/apiKey.service");

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
        throw new ForbiddenError("Forbidden Error");
    }

    //check objkey in database
    const objKey = await findById(key);
    if (!objKey) {
        throw new ForbiddenError("Forbidden Error");
    }

    req.objKey = objKey;
    return next();
};

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            throw new ForbiddenError("Permission Denied");
        }
        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            throw new ForbiddenError("Permission Denied");
        }

        return next();
    };
};

const asyncHandler = (payload) => {
    return (req, res, next) => {
        payload(req, res, next).catch(next);
    };
};

module.exports = {
    apiKey,
    permission,
    asyncHandler,
};
