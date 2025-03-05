const mongoose = require("mongoose");

const WorkstationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["Active", "Under Maintenance"],
            default: "Active",
        },
    },
    { timestamps: true }
);

const Workstation = mongoose.model("Workstation", WorkstationSchema);

const seedWorkstations = async () => {
    const count = await Workstation.countDocuments();
    if (count === 0) {
        const workstations = [
            { name: "Welding", status: "Active" },
            { name: "Packaging", status: "Active" },
            { name: "Cutting", status: "Active" },
            { name: "Assembly", status: "Active" },
            { name: "Painting", status: "Active" },
            { name: "Quality Control", status: "Active" },
            { name: "Molding", status: "Under Maintenance" },
            { name: "Inspection", status: "Active" }
        ];
        await Workstation.insertMany(workstations);
        console.log("Workstations seeded successfully!");
    }
};

seedWorkstations();

module.exports = Workstation;
