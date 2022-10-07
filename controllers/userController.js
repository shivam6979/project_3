const userModel = require("../models/userModel")
    // const middlware = require("../middleware/validator")

const jwt = require("jsonwebtoken")

const isvalid = function(value) {
    if (typeof value === "undefine" || value === null) return false
    if (typeof value !== "string") return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}


const isvalidBody = function(body) {
    return Object.keys(body).length > 0
}
const isValidTitle = function(title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) != -1;

}
const createUser = async function(req, res) {
    try {
        let userBody = req.body;

        if (!isvalidBody(userBody)) {
            res.status(400).send({ status: false, message: "Please provide mandatory info" })
        }

        let {
            title,
            name,
            phone,
            email,
            password
        } = userBody
        console.log("1")

        if (!title) {
            return res.status(400).send({ status: false, message: "Please provide title" });
        }

        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, message: "Please provide valid title like [Mr Mrs Miss]" });
        }


        console.log("2")


        if (!name) {
            return res.status(400).send({ status: false, message: "Please enter name" });
        }

        if (!/^[a-zA-Z]{3,}$/.test(name)) {
            return res.status(400).send({ status: false, message: "Please enter name" });
        }




        if (!(phone)) {
            return res.status(400).send({ status: false, message: "Please provide phone number" });
        }

        if (!/[0-9]{10}/.test(phone)) {
            return res.status(400).send({ status: false, message: "Please provide valid phone number" });
        }
        const phoneUse = await userModel.findOne({ phone: phone })
        if (phoneUse) {
            return res.status(400).send({
                status: false,
                message: "This phone number already in use"
            })
        }





        if (!email) {
            return res.status(400).send({ status: false, message: "Please provide email" });
        }

        if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
            return res.status(400).send({ status: false, message: "Please provide valid email" });
        }
        const emailUse = await userModel.findOne({ email: email })
        if (emailUse) {
            return res.status(400).send({
                status: false,
                message: "This email already in use"
            })
        }



        if (!password) {
            return res.status(400).send({ status: false, message: "Please Enter password" });
        }

        if (!/^[a-zA-Z0-9]{8,15}$/.test(password)) {
            return res.status(400).send({ status: false, message: "Please enter valid password" });
        }


        let userCreated = await userModel.create(userBody)
        res.status(201).send({
            status: true,
            message: "success",
            data: userCreated
        })



    } catch (err) {
        res.status(500).send({ status: false, errroe: err.meaasge })
    }
}

module.exports.createUser = createUser;


// ================================== USER LOGIN ===================






const loginUser = async function(req, res) {
    try {
        let emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

        const data = req.body;
        if (!isvalidBody(data)) {
            return res
                .status(400)
                .send({ status: false, message: "Please provide email and password" });
        }
        let { email, password } = data;

        if (!isvalid(email)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: "email is required ",
                });
        }
        if (!email.match(emailRegex))
            return res.status(400).send({ status: false, msg: "Email is not valid" });
        if (!isvalid(password)) {
            return res
                .status(400)
                .send({ status: false, message: "password is required" });
        }

        const checkCredentials = await userModel.findOne({
            email: data.email,
            password: data.password,
        });
        if (!checkCredentials) {
            return res
                .status(400) //401
                .send({ status: false, message: "invalid login data" });
        }


        // A MongoDB ObjectId is a 12 - byte UUID can be used as a HEX string representation with 24 chars in length.
        // You need to convert it to string to show it in console using console.log.

        // So, you have to do this:
        // console.log(user._id.toString());


        let token = jwt.sign({ authorId: checkCredentials._id.toString() },
            "projectmanage_03"
        );
        res.header("x-api-key", token);
        res.status(200).send({ status: true, token: token });
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};

module.exports.loginUser = loginUser;