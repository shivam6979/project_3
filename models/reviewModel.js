const mongoose = require("mongoose");
const moment = require("moment")
const ObjectId = mongoose.Schema.Types.ObjectId;


const rewiewSchema = new mongoose.Schema({

    bookId: {
        type: ObjectId,
        ref: "Books",
        require: true
    },
    reviewedBy: {
        type: String,
        require: true,
        default: 'Guest',
        value: {
            type: ObjectId,
            ref: "name"
        }
    },
    reviewedAt: { type: Date, default: () => moment().format('YYYY-MM-DD HH:mm:ss'), require: true },
    rating: { type: Number, require: true },
    review: { type: String },
    isDeleted: { type: Boolean, default: false },



});
module.exports = mongoose.model("Review", rewiewSchema)