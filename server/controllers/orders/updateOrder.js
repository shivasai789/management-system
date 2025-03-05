const Order = require("../../models/Order")
const axios = require("axios");


const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.query

        if (!status || status.trim().length === 0 || !["Planned", "In Production", "Quality Check", "Completed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status!" })
        }

        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true })

        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

        if (status === "Completed") {
            for (const item of updatedOrder.materialsUsed) {
                try {
                    await axios.put(`${process.env.SERVER_BASE_URL}api/materials/${item.materialId}`, {
                        quantity: item.quantity
                    })
                } catch (error) {
                    console.log("Error while calling update endpoint")
                }
            }
        }

        const order = await Order.findById(id)

        res.status(200).json({ success: true, message: "Order updated successfully!", order });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = updateOrder;