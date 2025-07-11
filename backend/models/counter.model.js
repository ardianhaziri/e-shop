import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			required: true,
			unique: true,
		},
		seq: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;