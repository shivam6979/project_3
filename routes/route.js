const { Router, application } = require("express");
const express = require("express");

const middleware = require("../middleware/validator")

const router = express.Router();
const bookController = require("../controllers/bookController")
const userController = require("../controllers/userController")
const reviewController = require("../controllers/reviewController")

// -------------------  for book API's  =======================
router.post("/books", bookController.createBook)
router.get("/books", middleware.authenticate, bookController.getBooksByQuaryParams)








// -------------------  for user API's  =======================
router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)








// -------------------  for review API's  =======================
router.post("/books/:bookId/review", reviewController.createReview)
router.post("/books/:bookId/review/:reviewId", reviewController.updatereview)






router.all("*", function(req, res) {
    res.status(400).send({ status: false, message: "invalid url" })
})

router.get("/test", function(req, res) {
    res.send("Programm is running on port 3700")
});

module.exports = router;