import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addDepartment,
  getDepartments,
  editDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";

const router = express.Router();

router.post("/add", authMiddleware, addDepartment);
router.get("/getAll", authMiddleware, getDepartments);
router.get("/editDepartment/:_id", authMiddleware, editDepartment);
router.put("/:_id", authMiddleware, updateDepartment); // Assuming you want to update the department
router.delete("/:_id", authMiddleware, deleteDepartment); // Assuming you want to delete the department
export default router;
