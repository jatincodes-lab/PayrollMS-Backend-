import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
  empId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  basicSalary: {
    type: Number,
    required: true,
  },
  allowance: {
    type: Number,
    default: 0,
  },
  deduction: {
    type: Number,
    default: 0,
  },
  netSalary: {
    type: Number,
  },
  payDate: {
    type: Date,
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

// Auto-calculate net salary before saving
salarySchema.pre("save", function (next) {
  this.netSalary = this.basicSalary + this.allowance - this.deduction;
  this.updatedAt = Date.now(); // Also update updatedAt
  next();
});

const Salary = mongoose.model("Salary", salarySchema);

export default Salary;
