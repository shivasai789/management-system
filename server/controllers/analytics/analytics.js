const Order = require("../../models/Order");
const Material = require("../../models/Material");

const getAnalyticsOverview = async (req, res) => {
    try {
        // Total Orders Count
        const totalOrders = await Order.countDocuments();

        // Orders Grouped by Status
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Material Usage Stats
        const materialUsage = await Order.aggregate([
            { $unwind: "$materialsUsed" },
            {
                $group: {
                    _id: "$materialsUsed.materialId",
                    totalUsed: { $sum: "$materialsUsed.quantity" }
                }
            },
            {
                $lookup: {
                    from: "materials",
                    localField: "_id",
                    foreignField: "_id",
                    as: "material"
                }
            },
            { $unwind: "$material" },
            {
                $project: {
                    _id: 0,
                    materialName: "$material.name",
                    totalUsed: 1
                }
            }
        ]);

        res.status(200).json({ success: true,overview: [
            totalOrders, ordersByStatus, materialUsage
        ] });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = getAnalyticsOverview;
