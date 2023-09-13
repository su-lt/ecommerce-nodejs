"use strict";
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");

// services //
const KeyTokenService = require("./keyToken.service");
const { findByEmail } = require("./shop.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const RoleStatus = require("../helpers/rolePhrases");
const {
    BadRequestError,
    CreateDatabaseError,
    ForbiddenError,
    AuthFailureError,
} = require("../core/error.response");

class AccessService {
    static handlerRefreshToken = async ({ refreshToken, user, keyStore }) => {
        const { userId, email } = user;
        // check refresh token in refresh token used
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            // if exist - remove
            await KeyTokenService.removeKeyByUserId(userId);
            throw new ForbiddenError(
                "Something wrong happened !!! Please re-login"
            );
        }
        // if not exist - check refresh token in keyStore with refresh user's token
        if (keyStore.refreshToken !== refreshToken)
            throw new AuthFailureError("Shop not registered"); // if different refresh token
        // if refresh token match -  found shop
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new AuthFailureError("Shop not registered !");
        // create new access token and refresh token
        //  -> genarate tokens
        const tokens = await createTokenPair(
            { userId, email },
            keyStore.publicKey,
            keyStore.privateKey
        );
        //  -> update new tokens pair
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken, //add onl refreshToken to usedl ist
            },
        });

        return {
            user,
            tokens,
        };
    };

    static logout = async (keyStore) => {
        return await KeyTokenService.removeKeyById(keyStore._id);
    };

    static login = async ({ email, password, refreshToken = null }) => {
        // check email
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new BadRequestError("Shop not registered !");
        // match password
        const match = bcrypt.compare(password, foundShop.password);
        if (!match) throw new AuthFaolureError("Authentication failed");
        // create access token and refresh token and save
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");
        const { _id: userId } = foundShop;
        //  -> genarate tokens
        const tokens = await createTokenPair(
            { userId, email },
            publicKey,
            privateKey
        );
        //  -> save
        await KeyTokenService.createKeyToken({
            userId,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });

        // get data return login
        return {
            shop: getInfoData({
                fields: ["_id", "name", "email"],
                object: foundShop,
            }),
            tokens,
        };
    };

    static signUp = async ({ name, email, password }) => {
        // step1: check email exists ???
        const holderShop = await shopModel.findOne({ email }).lean();
        //if exists, return shop exists
        if (holderShop) {
            throw new BadRequestError("Eror: Shop already exists !");
        }
        //if not exists, create new shop
        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleStatus.SHOP],
        });
        //newShop create successfully
        if (newShop) {
            //create privateKey, publicKey
            /*
             * Basic level
             */
            const privateKey = crypto.randomBytes(64).toString("hex");
            const publicKey = crypto.randomBytes(64).toString("hex");
            /* 
                 * high level - with big system
                 * 
                const { privateKey, publicKey } = crypto.generateKeyPairSync(
                    "rsa",
                    {
                        modulusLength: 4096,
                        privateKeyEncoding: {
                            type: "pkcs1", //public key crypto standards 1
                            format: "pem",
                        },
                        publicKeyEncoding: {
                            type: "pkcs1", //public key crypto standards 1
                            format: "pem",
                        },
                    }
                );
                */
            // console.log({ privateKey, publicKey }); //save collection keytstore

            // High level
            // const publicKeyObject = crypto.createPublicKey(keyStore);
            // console.log("publicKeyObject", publicKeyObject);
            // //create token pair
            // const tokens = await createTokenPair(
            //     { userId: newShop._id },
            //     publicKeyObject,
            //     privateKey
            // );

            //create token pair
            const tokens = await createTokenPair(
                { userId: newShop._id },
                publicKey,
                privateKey
            );
            // console.log("create tokens successfully", tokens);

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken,
            });

            if (!keyStore) {
                throw new CreateDatabaseError(
                    "Error: Cannot created key tokens"
                );
            }

            return {
                code: 201,
                metadata: {
                    shop: getInfoData({
                        fields: ["_id", "name", "email"],
                        object: newShop,
                    }),
                    tokens,
                },
            };
        }

        throw new CreateDatabaseError("Error: Cannot created new shop");
    };
}

module.exports = AccessService;
