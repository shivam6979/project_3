const express = require("express");

const bodyParser = require("body-Parser");
const { default: mongoose } = require("mongoose");
const route = require("./routes/route")

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://shiva:ZxJf1KONMThYSpCU@cluster0.yuxls.mongodb.net/Radon_project_three", {
        useNewUrlParser: true
    }).then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))
app.use("/", route)

app.listen(process.env.PORT || 3700, function() {
    console.log("Express is running on port:- " + (process.env.PORT || 3700))
});