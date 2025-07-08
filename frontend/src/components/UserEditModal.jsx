import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, User, Mail, Shield, Loader } from "lucide-react";
import { useUserManagementStore } from "../stores/useUserManagementStore";

const UserEditModal = ({ isOpen, onClose, user }) => {
	const { updateUser, loading } = useUserManagementStore();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		role: "customer",
	});

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || "",
				email: user.email || "",
				role: user.role || "customer",
			});
		}
	}, [user]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateUser(user._id, formData);
			onClose();
		} catch {
			// Error is handled in the store
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<motion.div
				className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				transition={{ duration: 0.3 }}
			>
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold text-white">Edit User</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-white transition-colors duration-200"
					>
						<X className="h-6 w-6" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							<User className="inline h-4 w-4 mr-2" />
							Name
						</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
							placeholder="Enter user name"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							<Mail className="inline h-4 w-4 mr-2" />
							Email
						</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
							placeholder="Enter email address"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							<Shield className="inline h-4 w-4 mr-2" />
							Role
						</label>
						<select
							name="role"
							value={formData.role}
							onChange={handleChange}
							className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
						>
							<option value="customer">Customer</option>
							<option value="admin">Admin</option>
						</select>
					</div>

					<div className="flex justify-end space-x-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
						>
							{loading ? (
								<>
									<Loader className="h-4 w-4 mr-2 animate-spin" />
									Updating...
								</>
							) : (
								"Update User"
							)}
						</button>
					</div>
				</form>
			</motion.div>
		</div>
	);
};

export default UserEditModal;