"use strict";

const keyTokenModel = require("../models/keyToken.model");
const { Types } = require("mongoose");

class KeyTokenService {
    static createKeyToken = async ({
        userId,
        publicKey,
        privateKey,
        refreshToken,
    }) => {
        try {
            // High level
            // const publicKeyString = publicKey.toString();

            // //level 0
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     privateKey: privateKey,
            //     // publicKey: publicKeyString, // high level
            //     publicKey: publicKey,
            // });
            // return tokens ? tokens.publicKey : null;

            // level xxx
            const filter = { user: userId };
            const update = {
                publicKey,
                privateKey,
                refreshTokensUsed: [],
                refreshToken,
            };
            const options = { upsert: true, new: true };

            const tokens = await keyTokenModel.findOneAndUpdate(
                filter,
                update,
                options
            );

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };

    static findByUserId = async (userId) => {
        const found = await keyTokenModel
            .findOne({ user: new Types.ObjectId(userId) })
            .lean();
        return found;
    };

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne(id);
    };

    static removeKeyByUserId = async (userId) => {
        return await keyTokenModel.deleteOne({ user: userId });
    };

    static findByRefreshTokenUsed = async (refreshToken) => {
        console.log("ccccccc:::::", refreshToken);
        return await keyTokenModel
            .findOne({ refreshTokensUsed: refreshToken })
            .lean();
    };

    static findByRefreshToken = async (refreshToken) => {
        console.log("aaaaaaabbbb:::::", refreshToken);
        return await keyTokenModel.findOne({ refreshToken });
    };
}

module.exports = KeyTokenService;
