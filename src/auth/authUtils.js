"use strict";
const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //accessToken
        const accessToken = await JWT.sign(payload, publicKey, {
            // algorithm: "RS256", // High-level
            expiresIn: "2 days",
        });
        //refreshToken
        const refreshToken = await JWT.sign(payload, privateKey, {
            // algorithm: "RS256", // High-level
            expiresIn: "7 days",
        });
        //verify
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log(`error verify::`, err);
            } else {
                console.log(`decode verify`, decode);
            }
        });
        return { accessToken, refreshToken };
    } catch (error) {
        return error.message;
    }
};

module.exports = { createTokenPair };
