const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        currentStock: {
            type: Number,
            required: true,
            min: 0, // Ensures stock cannot be negative
        },
        minimumStockLevel: {
            type: Number,
            required: true,
            min: 0, // Ensures minimum level is valid
        },
    },
    { timestamps: true }
);

const Material = mongoose.model("Material", MaterialSchema);

const seedMaterials = async () => {
    const count = await Material.countDocuments();
    if (count === 0) {
        const materials = [
            { name: "Steel", currentStock: 500, minimumStockLevel: 100 },
            { name: "Plastic", currentStock: 300, minimumStockLevel: 50 },
            { name: "Aluminum", currentStock: 400, minimumStockLevel: 80 },
            { name: "Copper", currentStock: 250, minimumStockLevel: 60 },
            { name: "Rubber", currentStock: 350, minimumStockLevel: 90 },
            { name: "Glass", currentStock: 200, minimumStockLevel: 40 },
            { name: "Wood", currentStock: 600, minimumStockLevel: 150 },
            { name: "Ceramic", currentStock: 180, minimumStockLevel: 30 }
        ];
        await Material.insertMany(materials);
        console.log("Materials seeded successfully!");
    }
};

seedMaterials();


module.exports = Material;
