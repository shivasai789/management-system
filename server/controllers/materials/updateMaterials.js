const Material = require("../../models/Material");

const updateMaterials = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid quantity value" });
        }

        const material = await Material.findById(id);
        if (!material) {
            return res.status(404).json({ message: "Material not found!" });
        }

        // Check if enough stock is available
        if (material.currentStock < quantity) {
            return res.status(400).json({ message: "Not enough stock available!" });
        }

        // Update stock and save
        material.currentStock -= quantity;
        await material.save();

        return res.status(200).json({ message: "Updated successfully!", material });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = updateMaterials;
