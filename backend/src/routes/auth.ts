import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
import { UserModel } from "../db/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new UserModel({ email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        res.status(201).json({ result: user, token });
    } catch (error) {
        res.status(500).json(error.message);
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        res.status(200).json({ result: user, token });
    } catch (error) {
        res.status(500).json(error.message);
    }
});

export default router;
