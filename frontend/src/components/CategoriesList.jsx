import { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Users } from "lucide-react";
import { useCategoryStore } from "../stores/useCategoryStore";
import { useProductStore } from "../stores/useProductStore";

const CategoriesList = ({ onEditCategory, onAssignProducts }) => {
	const { categories, deleteCategory, loading } = useCategoryStore();
	const { products } = useProductStore();

	const getProductCount = (categoryName) => {
		return products.filter(product => product.category === categoryName).length;
	};

	const handleDelete = async (categoryId) => {
		if (window.confirm("Are you sure you want to delete this category?")) {
			await deleteCategory(categoryId);
		}
	};

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg p-6 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Categories</h2>

			{loading && (
				<div className='flex justify-center py-8'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400'></div>
				</div>
			)}

			{!loading && categories.length === 0 && (
				<p className='text-gray-400 text-center py-8'>No categories found. Create your first category!</p>
			)}

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{categories.map((category) => (
					<motion.div
						key={category._id}
						className='bg-gray-700 rounded-lg p-4 border border-gray-600'
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.3 }}
					>
						<div className='aspect-w-16 aspect-h-9 mb-4'>
							<img
								src={category.image}
								alt={category.name}
								className='w-full h-48 object-cover rounded-lg'
							/>
						</div>
						
						<h3 className='text-lg font-semibold text-white mb-2'>{category.name}</h3>
						
						{category.description && (
							<p className='text-gray-400 text-sm mb-3 line-clamp-2'>
								{category.description}
							</p>
						)}
						
						<div className='flex items-center justify-between text-sm'>
							<div className='flex items-center text-gray-400'>
								<Users className='h-4 w-4 mr-1' />
								{getProductCount(category.name)} products
							</div>
							
							<div className='flex space-x-2'>
								<button
									onClick={() => onEditCategory(category)}
									className='p-1 text-gray-400 hover:text-emerald-400 transition-colors duration-200'
									title='Edit category'
								>
									<Edit className='h-4 w-4' />
								</button>
								<button
									onClick={() => onAssignProducts(category)}
									className='p-1 text-gray-400 hover:text-blue-400 transition-colors duration-200'
									title='Assign products'
								>
									<Users className='h-4 w-4' />
								</button>
								<button
									onClick={() => handleDelete(category._id)}
									className='p-1 text-gray-400 hover:text-red-400 transition-colors duration-200'
									title='Delete category'
								>
									<Trash2 className='h-4 w-4' />
								</button>
							</div>
						</div>
						
						<div className='mt-3 text-xs text-gray-500'>
							Created: {new Date(category.createdAt).toLocaleDateString()}
						</div>
					</motion.div>
				))}
			</div>
		</motion.div>
	);
};

export default CategoriesList;