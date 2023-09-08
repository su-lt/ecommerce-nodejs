"use strict";
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const Role = require("../helpers/role");

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            // step1: check email exists ???
            const holderShop = await shopModel.findOne({ email }).lean();
            //if exists, return shop exists
            if (holderShop) {
                return {
                    code: "xxxx",
                    message: "shop already exists",
                };
            }
            //if not exists, create new shop
            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [Role.SHOP],
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

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey,
                });

                if (!keyStore) {
                    return {
                        code: "xxxx",
                        message: "keyStore error",
                    };
                }
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

            return {
                code: 200,
                metadata: null,
            };
        } catch (error) {
            return {
                code: "xxx",
                message: error.message,
                status: "error",
            };
        }
    };
}

module.exports = AccessService;
