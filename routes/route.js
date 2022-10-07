const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const reviewController = require("../controllers/reviewController");
const middleware = require("../middleware/auth");
const aws=require("aws-sdk");
const multer=require("multer")




router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

aws.config.update({
  accessKeyId:"AKIAY3L335MCRVFM24Q7U",
  secretAccessKeyId:"hfgytdey8urr+=+965986856ujtiut8tu",
  region:"south-east-3"
})
let uploadfile=async function(file) {
let s3=new aws.S3({apiVersion:"2006-03-01"});
let uploadParams={
  ACL:"public-read",
  Bucket:"classroom-training-bucket",
  key:"abc/"+ file.originalname,
Body:"file.buffer"
}

s3.upload(uploadParams,function(err,data){
  if(err) return reject ({"error":err})
  console.log(data)
  console.log("file upload successfully")
  return resolve(data.Location)
})
}
router.post("/write-file-aws",async function(req,res){
  try{
let files =req.files;
if(files && files.length>0){
  let uploadedFileURL=await uploadfile(files[0])
  return res.status(201).send({message:"uploaded successfully",data:uploadedFileURL})
}
else{
  return res.status(400).send({status:false,message:"No file found"})
}
  }catch(err){
return res.status(500).send({status:false,message:err})
  }
})
//Api for creating user
router.post("/register", userController.registerUser);

//Api for login user
router.post("/login", userController.loginUser);

//Api for posting books
router.post("/books",middleware.authentication,bookController.createBook);

//Api for getting books by query params
router.get("/books", middleware.authentication, bookController.getBooks);

//Api for getting books by userId in path params
router.get("/books/:bookId",middleware.authentication,bookController.getBooksById);

//Api for updating books by bookId in path params
router.put("/books/:bookId",middleware.authentication,middleware.authorisation,bookController.updateBook);

//Api for deleting books by bookId in path params
router.delete("/books/:bookId",middleware.authentication,middleware.authorisation,bookController.deleteBook);

//Api for posting review  by bookId in path params
router.post("/books/:bookId/review", reviewController.createReview);

//Api for updating review  by bookId and review id in path params
router.post("/books/:bookId/review/:reviewId", reviewController.createReview);

//Api for deleting review  by bookId and review id in path params
router.put("/books/:bookId/review/:reviewId", reviewController.reviewUpdate);

router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview);


// if api is invalid OR wrong URL
router.all("/*", function (req, res) {
  res.status(404).send({ status: false, msg: "The api you requested is not available" });
});

module.exports = router;