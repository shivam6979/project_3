const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel");



// ------------------------// authentication  ==   certificate----------------->

let authenticate = async function(req, res, next) {
    try {
        let token = req.headers['x-api-key'];

        if (!token) {
            res.status(400).send({ status: false, message: "please provide token" })
        }
        const decodedToken = jwt.verify(token, "projectmanage_03")

        if (!decodedToken) {
            return res.status(400).send({ status: false, message: "Invalid token" })
        }

        req.decodedToken = decodedToken
        next();

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};


module.exports.authenticate = authenticate;





// ------------------------------->  authorization == permision   <---------------------------


const authorization = async function(req, res, next) {
    try {
        let userId = req.params.userId

        if (!userId) {
            res.status(400).send({ status: false, message: "Please provide user Id" })
        }

        let userData = await bookModel.findById(userId).select({ userId: 1, _id: 0 })

        if (!userData) {
            res.status(400).send({ status: false, message: "user doesn't exists" })
        }

        let token = req.headers["x-api-key"];

        if (!token) {
            res.status(400).send({ status: false, message: "please provide token" })
        }

        const decodedToken = jwt.verify(token, "projectmanage_03")

        if (!decodedToken) {
            return res.status(400).send({ status: false, message: "Invalid token" })
        }
        // if (decodedToken.userId != userData.userId) {
        //     return res.status(403).send({ status: false, msg: "Not Authorized" })

        // }

        next();

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};
module.exports.authorization = authorization;