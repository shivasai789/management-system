const express = require("express");
const getWorkstation = require("../controllers/workstations/getWorkstations")

const router = express.Router();

router.get("/", getWorkstation)

module.exports = router;