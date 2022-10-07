const mongoose = require("mongoose");
const moment = require("moment")
const objectId = mongoose.Schema.Types.ObjectId;


const bookSchema = new mongoose.Schema({
    title: { type: String, require: true, unique: true },
    excerpt: { type: String, unique: true },
    userId: {
        type: objectId,
        ref: "name",
        unique: true,
    },
    ISBN: { type: String, require: true, unique: true },
    category: { type: String, require: true },
    subcategory: [{
        type: String,
        require: true
    }],
    reviews: {
        type: Number,
        default: 0,
        comment: Number
    },
    deletedAt: { type: Date, default: () => moment().format('YYYY-MM-DD HH:mm:ss') },
    isDeleted: { type: Boolean, default: false },
    releasedAt: { type: Date, require: true },

}, { timestamps: true });
module.exports = mongoose.model("Books", bookSchema)