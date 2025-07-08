import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    dep_name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

departmentSchema.pre("findOneAndDelete", async function (next) {
    const departmentId = this.getQuery()._id;
    
  try {
    const Employee = mongoose.model("Employee");
    const User = mongoose.model("User");
    const Leave = mongoose.model("Leave");
    const Salary = mongoose.model("Salary");

    // Find all employees in the department
    const employees = await Employee.find({ department: departmentId });

    for (const emp of employees) {
      // Delete leaves linked to the employee's user
      await Leave.deleteMany({ userId: emp.userId });

      // Delete salaries linked to the employee
      await Salary.deleteMany({ empId: emp._id });

      // Delete the user
      await User.findByIdAndDelete(emp.userId);

      // Delete the employee
      await Employee.findByIdAndDelete(emp._id);
    }

    next();
  } catch (err) {
    console.error("Error in department pre-delete hook:", err);
    next(err);
  }
});

const Department = mongoose.model("Department", departmentSchema);
export default Department;