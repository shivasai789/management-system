const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const createOrder = require("../controllers/orders/createOrder");
const getOrder = require("../controllers/orders/getOrder");
const updateOrder = require("../controllers/orders/updateOrder");
const deleteOrder = require("../controllers/orders/deleteOrder");

const router = express.Router();

router.post("/", authenticate, createOrder);

router.get("/", getOrder);

router.put("/:id/", updateOrder);

router.delete("/:id", authenticate, deleteOrder)

module.exports = router;