import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

const addLeave = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, description } = req.body;
    const leave = new Leave({
      userId: req.user[0]._id, // from auth middleware
      leaveType,
      fromDate,
      toDate,
      description,
    });

    await leave.save();

    res
      .status(201)
      .json({ success: true, message: "Leave added successfully", leave });
  } catch (error) {
    console.error("Error adding leave:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getMyLeaves = async (req, res) => {
  try {
    // Find employee using user ID
    let { id } = req.params;
    let employee = await Employee.findOne({ userId: id });

    if (!employee) {
       employee = await Employee.findById(id);
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    // Get all leaves for that employee
    const leaves = await Leave.find({ userId: employee.userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      leaves,
    });
    
  } catch (error) {
    console.error("Error fetching leaves:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not fetch leaves.",
    });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    // Find employee using user ID
    const leaves = await Leave.find().populate("userId", "name");

    if (!leaves) {
      return res.status(404).json({
        success: false,
        message: "leaves not found.",
      });
    }

    return res.status(200).json({
      success: true,
      leaves,
    });
  } catch (error) {
    console.error("Error fetching leaves:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not fetch leaves.",
    });
  }
};

const getById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate(
      "userId",
      "name email profileImage"
    );

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found.",
      });
    }

    return res.status(200).json({
      success: true,
      leave,
    });
  } catch (error) {
    console.error("Error fetching leave:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not fetch leave.",
    });
  }
};

const changeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findByIdAndUpdate(req.params.id, { status });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found.",
      });
    }

    await leave.save();

    return res.status(200).json({
      success: true,
      message: "Leave status updated successfully.",
      leave,
    });
  } catch (error) {
    console.error("Error updating leave status:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not update leave status.",
    });
  }
};

export { getMyLeaves, getAllLeaves, addLeave, getById, changeStatus };
