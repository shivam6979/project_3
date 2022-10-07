const mongoose = require("mongoose");
// const objectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    name: { type: String, require: true },
    phone: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    address: {
        street: { type: String },
        city: { type: String },
        pincode: { type: String }
    },

});
module.exports = mongoose.model("User", userSchema)