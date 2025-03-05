const Order = require("../../models/Order")
const Material = require("../../models/Material");
const Workstation = require("../../models/Workstation")

const createOrder = async (req, res) => {
    try {
        const { productName, quantity, priority, materialsUsed, workstationId, endDate } = req.body;

        if (!productName || productName.trim().length === 0 || typeof productName === "String") {
            return res.status(400).json({success: false, message: "Invalid productName!" })
        }

        if (!quantity || quantity <= 0 || typeof quantity === "Number") {
            return res.status(400).json({ success: false,message: "Invalid quantity!" })
        }

        if (!priority || !["High", "Medium", "Low"].includes(priority) || typeof productName === "String") {
            return res.status(400).json({ success: false,message: "Invalid priority!" })
        }

        if (!workstationId || workstationId.trim().length === 0 || typeof workstationId === "String") {
            return res.status(400).json({success: false, message: "Invalid workstationId!" })
        }

        if (req.user.role !== "Manager") {
            return res.status(403).json({success: false, message: "Only Managers can create orders." });
        }

        // Validate Workstation
        const workstation = await Workstation.findById(workstationId);
        if (!workstation) {
            return res.status(404).json({success: false, message: "Workstation not found" });
        }

        // Validate Materials Stock
        for (const item of materialsUsed) {
            const material = await Material.findById(item.materialId);
            if (!material) {
                return res.status(404).json({success: false, message: `Material not found: ${item.materialId}` });
            }
            if (material.currentStock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for material: ${material.name}`,
                });
            }
        }

        // Create the Order
        const newOrder = await Order.create({
            productName,
            quantity,
            priority,
            status: "Planned",
            materialsUsed,
            workstationId,
            endDate,
            createdBy: req.user.id, // Assuming user ID is in the request
        });

        return res.status(201).json({ success: true, message: "Production Order created successfully", order: newOrder });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = createOrder;