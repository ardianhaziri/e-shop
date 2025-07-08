import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find({}).select("-password").sort({ createdAt: -1 });
		res.json({ users });
	} catch (error) {
		console.log("Error in getAllUsers controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, email, role } = req.body;

		// Check if user exists
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if email is already taken by another user
		if (email && email !== user.email) {
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				return res.status(400).json({ message: "Email already exists" });
			}
		}

		// Update user fields
		if (name) user.name = name;
		if (email) user.email = email;
		if (role) user.role = role;

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			role: updatedUser.role,
			createdAt: updatedUser.createdAt,
			updatedAt: updatedUser.updatedAt,
		});
	} catch (error) {
		console.log("Error in updateUser controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};