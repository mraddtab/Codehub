const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
    let token;
    const authorization = req.headers.authorization;

    if (authorization && authorization.startsWith("Bearer")) {
        try {
            token = authorization.split(' ')[1];
            const id = (jwt.verify(token, process.env.JWT_SECRET)).id;
            req.user = await User.findById(id).select("-password");   
            next();
        } 
        catch (error) {
            res.status(401);
            throw new Error("Not Authorized");
        }
    }

    if(!token) {
        res.status(401);
        throw new Error("Not Authorized. No token present.");
    }
});

module.exports = { protect }