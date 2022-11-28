const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/email");

router.post("/register", async(req, res) => {
    const {email, password, isAdmin} = req.body;

    try {
        const user = await User.findOne({email:email}).exec();
        if(user) {
            if(user.verified) {
                res.status(401).json("User already exists");
                return;
            }
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await User.create({email, password:hashedPassword, isAdmin});
        }

        const accessToken = jwt.sign({email, isAdmin}, process.env.JWT_SECRET, {expiresIn: 600});
        console.log(accessToken);
        await sendEmail(email, accessToken);
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
    res.json("EMAIL sent");
});

router.get("/verify/:token", async(req, res) => {
    const token = req.params.token;
    try {
        const {email:userEmail, isAdmin} = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({email:userEmail, isAdmin:isAdmin}).exec();
        if(user.verified) {
            res.json("Account is already verified. Login now");
            return;
        }
        user.verified = true;
        await user.save();
        res.json("Account verified! You can login now");
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
})

router.post("/login", async(req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({ email: email });
        if(!user) {
            return res.status(404).json("user not found");
        }
        if(!user.verified) {
            return res.status(400).json("Verify your account first");
        }
        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword) {
            return res.status(403).json("wrong password");
        }
        const accessToken = jwt.sign({email, isAdmin:user.isAdmin}, process.env.JWT_SECRET, {expiresIn:"1d"});
        // console.log(user.isAdmin);
        res.json({email, isAdmin: user.isAdmin, accessToken: "Bearer "+accessToken});
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})
module.exports = router;