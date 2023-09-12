"use strict";

const {
    ForbiddenError,
    AuthFailureError,
    NotFoundError,
} = require("../core/error.response");
const JWT = require("jsonwebtoken");

//services
const { findById } = require("../services/apiKey.service");
const { asyncHandler } = require("../helpers/asyncHandler");
const { findByUserId } = require("../services/keyToken.service");

const HEADERS = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization",
    CLIENT_ID: "x-client-id",
};

const authentication = asyncHandler(async (req, res, next) => {
    // check userId missing
    const userId = req.headers[HEADERS.CLIENT_ID];
    if (!userId) throw new AuthFailureError("Invalid Request");
    // check user in dbs
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError("Not found keyStore");
    // get access token
    const accessToken = req.headers[HEADERS.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError("Invalid Request");

    try {
        // verify token
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        // check keystore with user id
        if (userId !== decodeUser.userId)
            throw new AuthFailureError("Invalid UserID");
        // return next
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error;
    }
});

const apiKey = async (req, res, next) => {
    const key = req.headers[HEADERS.API_KEY]?.toString();
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

module.exports = {
    apiKey,
    permission,
    authentication,
};
