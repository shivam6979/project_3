const { isValidObjectId } = require("mongoose")
const bookModel = require("../models/bookModel")
const { modelName } = require("../models/reviewModel")
const userModel = require("../models/userModel")

const moment = require("moment")

// const userModel = require('../models/userModel')
// const middlware = require("../middleware/validator")


const isvalid = function(value) {
    if (typeof value === "undefine" || value === null) return false
    if (typeof value !== "string") return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}


const isValidBody = function(body) {
    return Object.keys(body).length > 0
}

const check = function(arr) {
    return arr.length > 0;
};




// ------------------------------->  createBook    <---------------------------


const createBook = async function(req, res) {
    try {
        let body = req.body;
        if (!isValidBody(body)) {
            res.status(400).send({ status: false, message: "Please provide mandatory info" })
        }
        let {
            title,
            excerpt,
            userId,
            ISBN,
            category,
            subcategory,
            releasedAt
        } = body

        if (!title) {
            res.status(400).send({ status: false, message: "Please provide book title" })
        }
        if (!/^[a-zA-Z0-9]{3,40}$/.test(title)) {
            res.status(400).send({ status: false, message: "Please provide valid Book title" })
        }
        let title1 = await bookModel.findOne({ title: title })
        if (title1) {
            res.status(400).send({ status: false, message: "title already exists" })
        }
        if (!excerpt) {
            res.status(400).send({ status: false, message: "Please provide excerpt for the book" })
        }
        //     // let g = /^[a-zA-Z]{3,}$/.test
        let excerptData = await bookModel.findOne({ excerpt: excerpt })

        if (excerptData) {
            res.status(400).send({ status: false, message: "This excerpt already in use" })
        }


        if (!userId) {
            res.status(400).send({ status: false, message: "Please provide  user Id" })
        }
        if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
            res.status(400).send({ status: false, message: "Please provide valid user Id" })
        }

        let userData = await bookModel.findOne({ userId: userId })

        if (userData) {
            return res.status(400).send({ status: false, message: "A book is already registered by this user id" })
        }
        if (!ISBN) {
            res.status(400).send({ status: false, message: "Please provide ISBN" })
        }
        if (!/^(?=(?:\D*\d){13}(?:(?:\D*\d){17})?$)[\d-]+$/.test(ISBN)) {
            res.status(400).send({ status: false, message: "Please provide valid ISBN" })
        }
        const ISBNUse = await bookModel.findOne({ ISBN: ISBN })
        if (ISBNUse) {
            return res.status(400).send({
                status: false,
                message: "This ISBN already in use"
            })
        }

        if (!category) {
            res.status(400).send({ status: false, message: "Please provide category fot the Book" })
        }

        if (!subcategory) {
            res.status(400).send({ status: false, message: "Please provide subcategory for the book" })
        }
        if (!check(subcategory)) {
            res.status(400).send({ status: false, message: "Please provide valid subcategory for the Book" })
        }
        if (!releasedAt) {
            res.status(400).send({ status: false, message: "Please provide release date for the Book" })
        }
        if (releasedAt > moment().format('YYYY-MM-DD HH:mm:ss')) {
            res.status(400).send({ status: false, message: "Please provide valid date in order [YYYY-MM-DD]" })
        }
        let bodyCreated = await bookModel.create(body)
        res.status(200).send({
            status: true,
            message: "success",
            data: bodyCreated
        })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};
module.exports.createBook = createBook;







// ------------------------------->  getBooksByQuaryParams == by bookid   <---------------------------




const getBooksByQuaryParams = async function(req, res, next) {
    try {
        const books = await bookModel.find({ isDeleted: false })
            // let getBook = req.query;

        if (!isValidBody(req.query)) {
            return res.status(200).send({ status: true, data: books })
        }
        let { userId } = req.query;
        if (userId) {
            if (!isValidObjectId(userId)) {
                return res.status(400).send({ status: false, msg: "enter valid user id" })
            }
            if (userId != req.decodedToken.userId) {
                return res.status(400).send({ status: false, msg: "not authorized" })
            }
        }
        let booksfind = await bookModel.find({ isDeleted: false }).select({ book_id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 }) //.countDocuments();
        res.status(200).send({
            status: true,
            data: booksfind
        })
        next();
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
};
module.exports.getBooksByQuaryParams = getBooksByQuaryParams





const getBookByPathParams = async function(req, res, ) {
    try {
        const books = await bookModel.find({ isDeleted: false }).sort({ title: 1 })

        if (!isValidBody(books)) {
            return res.status(200).send({ status: true, data: books })
        }
        let {
            userId
        } = req.params;
        if (userId) {
            if (!isValidObjectId(userId)) {
                return res.status(400).send({ status: false, msg: "enter valid user id" })
            }
            // if (userId != req.decodedToken.userId) {
            //     return res.status(400).send({ status: false, msg: "not authorized" })
            // }
        }
        let searchBlogs = await bookModel.find({
            $or: [
                { userId: req.query.userId }
            ]
        });

        // let result = [];
        // if (searchBlogs.length > 0) {
        //     for (let element of searchBlogs) {
        //         if (element.isDeleted == false && element.isPublished == true) {
        //             result.push(element);
        //         }
        //     }
        //     return res.status(200).send({ status: true, data: result });

        // }
        return res.status(200).send({ status: true, data: searchBlogs });

        next();
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};
module.exports.getBookByPathParams = getBookByPathParams