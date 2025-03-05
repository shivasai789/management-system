require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs")

const User = require("./models/User.js")
const authRoutes = require("./routes/auth.js")
const orderRoutes = require("./routes/orders.js")
const materialRoutes = require("./routes/materials.js")
const analyticsRoutes = require("./routes/analytics.js")
const workstationRoutes = require("./routes/workstation.js")

const app = express();
const port = process.env.PORT || 9000;

//database connnection
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to database");
}).catch(error => {
    console.log("Database Error: ", error)
})

app.use(
    cors()
)

app.use(express.json())

// creating manager while starting the server
const initializeManager = async () => {
    const existingManager = await User.findOne({ role: "Manager" });
    if (!existingManager) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const match = await bcrypt.compare("admin123", hashedPassword);
        console.log("Password match:", match);
        await User.create({
            username: "Admin Manager",
            email: "admin@company.com",
            password: hashedPassword,
            role: "Manager",
            department: "Assembly",
        });
        console.log("Default Manager created!");
    }
};

initializeManager();

app.get("/", (req, res) => {
    res.send("Hello from server!")
})

app.use("/api/auth", authRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/materials", materialRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/workstation", workstationRoutes)

app.listen(port, () => {
    console.log(`Server running on ${port}...`)
})