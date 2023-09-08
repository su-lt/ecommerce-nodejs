"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            // High level
            // const publicKeyString = publicKey.toString();
            const tokens = await keyTokenModel.create({
                user: userId,
                privateKey: privateKey,
                // publicKey: publicKeyString, // high level
                publicKey: publicKey,
            });
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };
}

module.exports = KeyTokenService;
