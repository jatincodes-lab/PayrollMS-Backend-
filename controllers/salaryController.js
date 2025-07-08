import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";

const addSalary = async (req, res) => {
  try {
    const { empId, basicSalary, allowance, deduction, payDate } = req.body;

    // Basic validation
    if (!empId || !basicSalary || !payDate) {
      return res.status(400).json({
        success: false,
        message: "empId, basicSalary, and payDate are required.",
      });
    }

    const newSalary = new Salary({
      empId,
      basicSalary,
      allowance: allowance || 0,
      deduction: deduction || 0,
      payDate,
    });

    await newSalary.save();

    res.status(201).json({
      success: true,
      message: "Salary added successfully",
      salary: newSalary,
    });
  } catch (error) {
    console.error("Error adding salary:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error while adding salary",
    });
  }
};

const getSalary = async (req, res) => {
  try {
    const id = req.params.id;

    // Try finding salaries by employee ID
    let salaries = await Salary.find({ empId: id }).sort({ payDate: -1 });

    let employee = await Employee.findById(id).populate("userId");

    // If not found by employee ID, try using user ID to get employee
    if (!salaries.length || !employee) {
      employee = await Employee.findOne({ userId: id }).populate("userId");

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      salaries = await Salary.find({ empId: employee._id }).sort({
        payDate: -1,
      });
    }

    res.status(200).json({
      success: true,
      salaries,
      employeeName: employee.userId.name,
    });
  } catch (err) {
    console.error("Error fetching salary:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};


export { addSalary, getSalary };
