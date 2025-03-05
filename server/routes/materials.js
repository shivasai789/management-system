const express = require("express");
const getMaterials = require("../controllers/materials/getMaterials")
const updateMaterials = require("../controllers/materials/updateMaterials")

const router = express.Router();

router.get("/", getMaterials)

router.put("/:id", updateMaterials)

module.exports = router;