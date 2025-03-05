const Material = require("../../models/Material")

const getMaterials = async (req, res) => {
    try {
        const materials = await Material.find();
        return res.status(200).json({ message: "fetched successfully!", materials })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = getMaterials