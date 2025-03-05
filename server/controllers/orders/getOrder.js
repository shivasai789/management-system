const Order = require("../../models/Order")
const Workstation = require("../../models/Workstation")

const getOrders = async (req, res) => {
    try {
        const { status, workstation } = req.query;
        const filters = {};

        if (!status || status.trim().length === 0 || !["Planned", "In Production", "Quality Check", "Completed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status!" })
        }

        const workstations = await Workstation.find();

        const WorkstationItem = workstations.filter(eachItem => eachItem.name === workstation);

        if (!WorkstationItem) {
            return res.status(400).json({ success: false, message: "Invalid workstation!" })
        }

        if (status) filters.status = status;
        if (workstation) filters.workstation = WorkstationItem._id;

        const orders = await Order.find(filters);

        res.status(200).json({ success:true, message: "successfully fetched!", orders });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = getOrders;