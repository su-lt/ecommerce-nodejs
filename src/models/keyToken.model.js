"use strict";

const { Schema, model, Types } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";
// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema(
    {
        user: {
            type: Types.ObjectId,
            required: true,
            ref: "Shop",
        },
        privateKey: {
            type: String,
            required: true,
        },
        publicKey: {
            type: String,
            required: true,
        },
        refreshTokensUsed: {
            type: Array,
            default: [], // refresh tokens used
        },
        refreshToken: { type: String, required: true },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);
