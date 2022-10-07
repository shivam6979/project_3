const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");


const isValidBody = function(body) {
    return Object.keys(body).length > 0;
}

const isValid = function(value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};
const check = function(arr) {
    return arr.length > 0;
};

// ================================== Create review  ===============

const createReview = async function(req, res) {
    try {
        let review = req.body;
        if (!isValidBody(review)) {
            res.status(400).send({ status: false, message: "Please provide mandatory info" })
        }

        let { bookId, reviewedBy, reviewedAt, rating } = review

        if (!bookId) {
            res.status(400).send({ status: false, message: "please enter bookid" })
        }
        if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(400).send({ status: false, message: "it's a valid ObjectId, proceed with `findById` call." })
        }
        let book = await bookModel.findOne({ bookId: bookId });
        if (!book) {
            res.status(400).send({ status: false, message: "No such book found" })
        }
        if (!reviewedBy) {
            res.status(400).send({ status: false, message: "please enter reviewer name" })
        }
        const rewiews = await reviewModel.findOne({})



        if (!reviewedAt) {
            res.status(400).send({ status: false, message: "please enter reviewed time" })
        }
        if (!rating) {
            res.status(400).send({ status: false, message: "please enter rating" })
        }
        if (!/^[1-5]{1}$/.test(rating)) {
            res.status(400).send({ status: false, message: "please enter rating" })
        }

        let reviewCrteated = await reviewModel.create(review)
        res.status(200).send({ status: true, meaaage: "Success", data: reviewCrteated })

    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
};
module.exports.createReview = createReview


// ==========================888888888888888888================================
const updatereview = async function(req, res) {
    try {
        let data = req.body

        const review = await reviewModel.findOne({
            _id: req.params.reviewId,
            isDeleted: false
        });
        if (review.authorId != req.decodedToken) {
            return res.status(400).send({ status: false, message: 'No authorised' })
        }
        let { review, rating, reviewedBy } = review;
        if (data.review) {
            if (!isValid(data.review)) {
                return res.status(400).send({ status: false, message: 'review is not valid' })
            }
        }
        updateData.review = data.review

        if (data.rating) {
            if (!isValid(data.rating)) {
                return res.status(400).send({ status: false, message: 'Please provide rating' })
            }
            if (!/^[1-5]{1}$/.test(rating)) {
                return res.status(400).send({ status: false, message: 'rating is not valid' })
            }
        }
        updateData.rating = data.rating;

        if (data.reviewedBy) {
            if (!isValid(data.reviewedBy)) {
                return res.status(400).send({ status: false, message: 'Please provide reviewer Name' })
            }
            let reviewUser = await userModel.findOne({ userId: userId });

            if (!reviewUser) {
                return res.status(400).send({ status: false, message: 'User not exists' })
            }
        }
        updateData.review = data.reviewedBy


    } catch (err) {
        res.status(500).send({ status: false, msg: error.message });
    }
};
module.exports.updatereview = updatereview;


// =======================



// const reviewdelete = async function(req, res) {
//         try {
//             let body = req.body;
//             if (!boby) return res
let updateReview = await reviewModel.findOneAndUpdate({
    $and: [{ _id: req.params.userId }, {
            _id: req.params.bookId
        },
        {
            isDeleted: false
        }
    ],
    updatedData:
}, { new: true });