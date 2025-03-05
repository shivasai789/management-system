const mongoose = require("mongoose");

const ProductionOrderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            unique: true,
        },
        productName: {
            type: String,
            required: true,
            trim: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        priority: {
            type: String,
            enum: ["High", "Medium", "Low"],
            required: true,
        },
        status: {
            type: String,
            enum: ["Planned", "In Production", "Quality Check", "Completed"],
            default: "Planned",
        },
        materialsUsed: [
            {
                materialId: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true },
                quantity: { type: Number, required: true, min: 1 },
            },
        ],
        workstationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workstation",
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);


ProductionOrderSchema.pre("save", async function (next) {
    if (!this.orderId) {
        const lastOrder = await this.constructor.findOne({}, {}, { sort: { createdAt: -1 } });
        const lastOrderId = lastOrder ? parseInt(lastOrder.orderId.split("-")[1]) + 1 : 1;
        this.orderId = `PROD-${String(lastOrderId).padStart(3, "0")}`;
    }
    next();
});

const ProductionOrder = mongoose.model("ProductionOrder", ProductionOrderSchema);
module.exports = ProductionOrder;
