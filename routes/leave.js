import express from "express";
import {
  addLeave,
  getMyLeaves,
  getAllLeaves,
  getById,
  changeStatus,
} from "../controllers/leaveController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/leave/add
router.post("/add", authMiddleware, addLeave);

// GET /api/leave/my
router.get("/my/:id", authMiddleware, getMyLeaves);
router.get("/getAll", authMiddleware, getAllLeaves);

router.put("/:id", authMiddleware, changeStatus);
router.get("/:id", authMiddleware, getById);

export default router;
