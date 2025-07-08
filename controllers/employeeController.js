import path from "path"
import Employee from "../models/Employee.js"
import User from "../models/User.js"
import bcrypt from "bcrypt"
import multer from "multer"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    },
});

const upload = multer({ storage: storage });

const addEmployee = async (req, res) => {
    
    try {
        const {
            name,
            empId,
            email,
            dob,
            gender,
            maritalStatus,
            designation,
            department,
            salary,
            password,
            role,
        } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, error: "user already registered as Employee" })
        }

        const hashPassword = await bcrypt.hash(password, 10);
      
        const newUser = new User({
            name,
            email,
            password: hashPassword,
            role,
            profileImage: req.file ? req.file.filename : "",
        })

        const savedUser = await newUser.save();
        const newEmployee = new Employee({
          userId: savedUser._id,
          empId,
          email, // must include
          dob,
          gender,
          maritalStatus,
          designation,
          department,
          salary,
          password: hashPassword, // optional, but your schema still has it
          role,
          image: req.file ? req.file.filename : "",
        });
          

        newEmployee.save();
        return res.status(200).json({ success: true, message: "employee created" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error" });
    }
    
}

const getEmployees = async (req, res) => {
    try {
      const employees = await Employee.find().populate("userId", { password: 0 }).populate("department");
      res.status(200).json({
        success: true,
        employees,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Get Employees Server side Error",
      });
    }
}

import mongoose from "mongoose";

// ...

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    let employee;

    // Check if ID is a valid ObjectId (i.e., could be Employee._id)
    if (mongoose.Types.ObjectId.isValid(id)) {
      // First try to find by Employee _id
      employee = await Employee.findById(id)
        .populate("userId", "name email role profileImage")
        .populate("department", "dep_name");
    }

    // If not found by Employee ID, or it's not a valid ObjectId, try finding by userId
    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate("userId", "name email role profileImage")
        .populate("department", "dep_name");
    }

    console.log(employee);
    

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const updateEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      empId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      role,
    } = req.body;

    // 1. Update User info
    const employee = await Employee.findById(id).populate("userId");
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    const userId = employee.userId._id;

    await User.findByIdAndUpdate(userId, {
      name,
      email,
      role,
    });

    // 2. Update Employee info
    await Employee.findByIdAndUpdate(id, {
      empId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
    });

    return res
      .status(200)
      .json({ success: true, message: "Employee updated successfully" });
  } catch (error) {
    console.error("Error updating employee:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const fetchEmployeesByDepId = async (req, res) => {
  try {
    const { id } = req.params;
    const employees = await Employee.find({ department: id })
      .populate("userId", "name")
      .select("empId"); 
    if (!employees) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const changePass = async (req, res) => {
  try {
    const userId = req.user[0]._id; // assuming you're using auth middleware
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch)
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect.",
      });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}

export {
  addEmployee,
  upload,
  getEmployees,
  getEmployeeById,
  updateEmployeeById,
  fetchEmployeesByDepId,
  changePass,
};