import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Upload, Loader, X } from "lucide-react";
import { useCategoryStore } from "../stores/useCategoryStore";

const EditCategoryForm = ({ category, onClose }) => {
	const [editCategory, setEditCategory] = useState({
		name: "",
		description: "",
		image: "",
	});

	const { updateCategory, loading } = useCategoryStore();

	useEffect(() => {
		if (category) {
			setEditCategory({
				name: category.name,
				description: category.description || "",
				image: category.image,
			});
		}
	}, [category]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateCategory(category._id, editCategory);
			onClose();
		} catch (error) {
			console.log("Error updating category:", error);
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setEditCategory({ ...editCategory, image: reader.result });
			};

			reader.readAsDataURL(file);
		}
	};

	if (!category) return null;

	return (
		<motion.div
			className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<motion.div
				className='bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4'
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
			>
				<div className='flex justify-between items-center mb-6'>
					<h2 className='text-2xl font-semibold text-emerald-300'>Edit Category</h2>
					<button
						onClick={onClose}
						className='text-gray-400 hover:text-white transition-colors'
					>
						<X className='h-6 w-6' />
					</button>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
							Category Name
						</label>
						<input
							type='text'
							id='name'
							name='name'
							value={editCategory.name}
							onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
							className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
							required
						/>
					</div>

					<div>
						<label htmlFor='description' className='block text-sm font-medium text-gray-300'>
							Description
						</label>
						<textarea
							id='description'
							name='description'
							value={editCategory.description}
							onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
							rows='3'
							className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
							placeholder='Optional description for the category'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-300 mb-2'>
							Current Image
						</label>
						{editCategory.image && (
							<img
								src={editCategory.image}
								alt='Current category image'
								className='w-full h-32 object-cover rounded-md mb-3'
							/>
						)}
						<div className='flex items-center'>
							<input 
								type='file' 
								id='image' 
								className='sr-only' 
								accept='image/*' 
								onChange={handleImageChange} 
							/>
							<label
								htmlFor='image'
								className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
							>
								<Upload className='h-4 w-4 inline-block mr-2' />
								Change Image
							</label>
						</div>
					</div>

					<div className='flex justify-end space-x-3 pt-4'>
						<button
							type='button'
							onClick={onClose}
							className='px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
						>
							Cancel
						</button>
						<button
							type='submit'
							className='px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader className='mr-2 h-4 w-4 animate-spin' aria-hidden='true' />
									Saving...
								</>
							) : (
								<>
									<Save className='mr-2 h-4 w-4' />
									Save Changes
								</>
							)}
						</button>
					</div>
				</form>
			</motion.div>
		</motion.div>
	);
};

export default EditCategoryForm;