import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addEmployee,
  upload,
  getEmployees,
  getEmployeeById,
  updateEmployeeById,
  fetchEmployeesByDepId,
  changePass,
} from "../controllers/employeeController.js";

const router = express.Router();

router.post("/add", authMiddleware, upload.single("image"), addEmployee);
router.get("/getAll", authMiddleware, getEmployees);
router.put("/update/:id", authMiddleware, updateEmployeeById);
router.get("/get/:id", authMiddleware, getEmployeeById);
router.get("/department/:id", authMiddleware, fetchEmployeesByDepId);
router.put("/change-password", authMiddleware, changePass);

// router.get("/editDepartment/:_id", authMiddleware, editDepartment);
// router.put("/:_id", authMiddleware, updateDepartment); // Assuming you want to update the department
// router.delete("/:_id", authMiddleware, deleteDepartment); // Assuming you want to delete the department
export default router;
