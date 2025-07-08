import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useCategoryStore = create((set, get) => ({
	categories: [],
	loading: false,

	getAllCategories: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/categories");
			set({ categories: response.data.categories, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch categories");
		}
	},

	createCategory: async (categoryData) => {
		set({ loading: true });
		try {
			const response = await axios.post("/categories", categoryData);
			set((state) => ({
				categories: [...state.categories, response.data],
				loading: false,
			}));
			toast.success("Category created successfully");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to create category");
		}
	},

	updateCategory: async (id, categoryData) => {
		set({ loading: true });
		try {
			const response = await axios.put(`/categories/${id}`, categoryData);
			set((state) => ({
				categories: state.categories.map((cat) => 
					cat._id === id ? response.data : cat
				),
				loading: false,
			}));
			toast.success("Category updated successfully");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to update category");
		}
	},

	deleteCategory: async (id) => {
		set({ loading: true });
		try {
			await axios.delete(`/categories/${id}`);
			set((state) => ({
				categories: state.categories.filter((cat) => cat._id !== id),
				loading: false,
			}));
			toast.success("Category deleted successfully");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to delete category");
		}
	},

	assignProductsToCategory: async (categoryId, productIds) => {
		set({ loading: true });
		try {
			await axios.post(`/categories/${categoryId}/assign-products`, {
				productIds,
			});
			set({ loading: false });
			toast.success("Products assigned to category successfully");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to assign products");
		}
	},
}));