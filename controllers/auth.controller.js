import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const userExists = await User.findOne({ email });
        if(userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
   
}


export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email" });
    }

    if(password.length < 6){
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ message: "User logged in successfully", user, token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
