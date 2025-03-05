const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const RegisterOperator = require("../controllers/auth/register");
const LoginUser = require("../controllers/auth/login")

const router = express.Router();


router.post("/register", authenticate, RegisterOperator);

router.post("/login", LoginUser);

router.get('/check-auth',authenticate, (req,res) => {
    const user = req.user
    res.status(200).json({
        success: true,
        message: "Authenticated User",
        user
      })
})

module.exports = router;