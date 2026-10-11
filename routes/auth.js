const express = require("express")
const router = express.Router()

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const ser_pass = process.env.JWT_SECRET;
const user = require("../models/user")

router.post("/register", async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        if (!email || !password || !name || !role) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const checkemail = await user.findOne({ email: email });
        if (checkemail) {
            return res.status(400).json({
                message: "email already in use"
            });
        }
        const totalid = await user.countDocuments();
        const id = `24bcs${totalid + 1}`
        const hash = await bcrypt.hash(password, 10)
        const User = await user.create({
            id: id,
            name,
            email,
            password: hash,
            role: role
        })

        return res.json({
            message: "registration is complete"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const checkemail = await user.findOne({ email });

        if (!checkemail) {
            return res.status(400).json({
                message: "Email or password is incorrect"
            });
        }

        const pass1 = await bcrypt.compare(password, checkemail.password);

        if (!pass1) {
            return res.status(400).json({
                message: "Email or password is incorrect"
            });
        }

        const token = jwt.sign(
            {
                id: checkemail._id.toString(),
                email: checkemail.email,
                role: checkemail.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }
        );

        res.cookie("token", token, {
            maxAge: 12 * 60 * 60 * 1000,
            httpOnly: true
        });

        return res.json({
            message: "You are logged in"
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router