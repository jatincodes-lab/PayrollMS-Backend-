import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addSalary, getSalary } from "../controllers/salaryController.js";

const router = express.Router();

router.post("/add", authMiddleware, addSalary);
router.get("/:id", authMiddleware, getSalary);
// router.put("/update/:id", authMiddleware, updateEmployeeById);
// router.get("/get/:id", authMiddleware, getEmployeeById);
// router.get("/department/:id", authMiddleware, fetchEmployeesByDepId);

export default router;
