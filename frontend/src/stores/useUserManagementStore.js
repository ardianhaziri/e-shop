import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserManagementStore = create((set) => ({
	users: [],
	loading: false,

	fetchAllUsers: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/users");
			set({ users: response.data.users, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Error fetching users");
		}
	},

	updateUser: async (userId, userData) => {
		set({ loading: true });
		try {
			const response = await axios.put(`/users/${userId}`, userData);
			const updatedUser = response.data;
			
			set((state) => ({
				users: state.users.map((user) =>
					user._id === userId ? updatedUser : user
				),
				loading: false,
			}));
			
			toast.success("User updated successfully");
			return updatedUser;
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Error updating user");
			throw error;
		}
	},
}));