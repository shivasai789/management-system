const Workstation = require("../../models/Workstation")

const getWorkstation = async (req, res) => {
    try {
        const workstation = await Workstation.find();
        return res.status(200).json({ message: "fetched successfully!", workstation })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = getWorkstation