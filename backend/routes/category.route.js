import express from "express";
import {
	getAllCategories,
	createCategory,
	updateCategory,
	deleteCategory,
	getCategoryById,
	assignProductsToCategory,
} from "../controllers/category.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", protectRoute, adminRoute, createCategory);
router.put("/:id", protectRoute, adminRoute, updateCategory);
router.delete("/:id", protectRoute, adminRoute, deleteCategory);
router.post("/:categoryId/assign-products", protectRoute, adminRoute, assignProductsToCategory);

export default router;