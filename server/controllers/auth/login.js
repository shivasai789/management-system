const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");


const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || email.trim().length === 0) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid email" });
        }

        if (!password || password.trim().length === 0 || password.length < 6) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid password" });
        }


        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ 
            success: false,
            message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({ 
            success: false,
            message: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ 
            success: true,
            message: 'Logged in Successfully',
            token, 
            user: user 
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = LoginUser