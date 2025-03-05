const express = require("express");
const getAnalyticsOverview = require("../controllers/analytics/analytics")

const router = express.Router();

router.get("/overview", getAnalyticsOverview)

module.exports = router;