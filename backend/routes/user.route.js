import express from "express";
import { getAllUsers, updateUser } from "../controllers/user.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllUsers);
router.put("/:id", protectRoute, adminRoute, updateUser);

export default router;