const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");


const RegisterOperator = async (req, res) => {
    try {
        const { username, email, password, role, department } = req.body;

        // Validate role assignment
        if (req.user.role !== "Manager" && role === "Operator") {
            return res.status(403).json({success: false, message: "Only Managers can register Operators" });
        }

        if (!username || username.trim().length === 0) {
            return res.status(400).json({success: false, message: "Invalid username" });
        }

        if (!email || email.trim().length === 0) {
            return res.status(400).json({success: false, message: "Invalid email" });
        }

        if (!password || password.trim().length === 0 || password.length < 6) {
            return res.status(400).json({success: false, message: "Invalid password" });
        }

        if (!role || role.trim().length === 0 || !["Manager", "Operator"].includes(role)) {
            return res.status(400).json({success: false, message: "Invalid role" });
        }

        if (!department || department.trim().length === 0 || !["Assembly", "Quality Control"].includes(department)) {
            return res.status(400).json({success: false, message: "Invalid department" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
            department,
        });

        await newUser.save();
        res.status(201).json({success: true, message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = RegisterOperator;
