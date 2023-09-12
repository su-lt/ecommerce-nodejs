"use strict";

const asyncHandler = (payload) => {
    return (req, res, next) => {
        payload(req, res, next).catch(next);
    };
};

module.exports = { asyncHandler };
