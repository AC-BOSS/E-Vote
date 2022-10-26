const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email");

router.post("/register", async(req, res) => {
    console.log(req.body);

    await sendEmail(req.body.email, "Hello", "Tune isme kya likha hai??");
    
    res.json("EMAIL sent");
});

module.exports = router;