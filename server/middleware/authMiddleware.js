const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(200).json({ success:false,message: "Access denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data (id, role) to request
        next();
    } catch (error) {
        res.status(200).json({ success:false, message: "Invalid token" });
    }
};

module.exports = { authenticate }
