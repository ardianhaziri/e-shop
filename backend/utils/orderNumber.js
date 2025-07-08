import Counter from "../models/counter.model.js";

/**
 * Atomically increments and returns the next order number
 * @returns {Promise<number>} The next order number
 */
export const getNextOrderNumber = async () => {
	try {
		// Use findOneAndUpdate with upsert to atomically increment the counter
		const counter = await Counter.findOneAndUpdate(
			{ name: "orderNumber" },
			{ $inc: { value: 1 } },
			{ 
				new: true, // Return the updated document
				upsert: true, // Create the document if it doesn't exist
				setDefaultsOnInsert: true // Apply defaults when creating
			}
		);
		
		return counter.value;
	} catch (error) {
		console.error("Error generating order number:", error);
		throw new Error("Failed to generate order number");
	}
};