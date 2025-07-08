import cloudinary from "../lib/cloudinary.js";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

export const getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find({ isActive: true });
		res.json({ categories });
	} catch (error) {
		console.log("Error in getAllCategories controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createCategory = async (req, res) => {
	try {
		const { name, description, image } = req.body;

		let cloudinaryResponse = null;

		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "categories" });
		}

		const category = await Category.create({
			name,
			description,
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
		});

		res.status(201).json(category);
	} catch (error) {
		console.log("Error in createCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateCategory = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, description, image } = req.body;

		const category = await Category.findById(id);

		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		let cloudinaryResponse = null;

		if (image && image !== category.image) {
			// Delete old image if it exists
			if (category.image) {
				const publicId = category.image.split("/").pop().split(".")[0];
				try {
					await cloudinary.uploader.destroy(`categories/${publicId}`);
				} catch (error) {
					console.log("Error deleting old image from cloudinary", error);
				}
			}
			
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "categories" });
		}

		const updatedCategory = await Category.findByIdAndUpdate(
			id,
			{
				name,
				description,
				image: cloudinaryResponse?.secure_url || category.image,
			},
			{ new: true }
		);

		res.json(updatedCategory);
	} catch (error) {
		console.log("Error in updateCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteCategory = async (req, res) => {
	try {
		const { id } = req.params;

		const category = await Category.findById(id);

		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		// Check if category has products
		const productCount = await Product.countDocuments({ category: category.name });
		if (productCount > 0) {
			return res.status(400).json({ 
				message: "Cannot delete category with existing products", 
				productCount 
			});
		}

		// Delete image from cloudinary
		if (category.image) {
			const publicId = category.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`categories/${publicId}`);
			} catch (error) {
				console.log("Error deleting image from cloudinary", error);
			}
		}

		await Category.findByIdAndDelete(id);

		res.json({ message: "Category deleted successfully" });
	} catch (error) {
		console.log("Error in deleteCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getCategoryById = async (req, res) => {
	try {
		const { id } = req.params;
		const category = await Category.findById(id);
		
		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}
		
		res.json({ category });
	} catch (error) {
		console.log("Error in getCategoryById controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const assignProductsToCategory = async (req, res) => {
	try {
		const { categoryId } = req.params;
		const { productIds } = req.body;

		const category = await Category.findById(categoryId);
		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		// Update all specified products to have this category
		const result = await Product.updateMany(
			{ _id: { $in: productIds } },
			{ category: category.name }
		);

		res.json({ 
			message: "Products assigned to category successfully", 
			modifiedCount: result.modifiedCount 
		});
	} catch (error) {
		console.log("Error in assignProductsToCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};