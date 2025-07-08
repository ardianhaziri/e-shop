import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader, X } from "lucide-react";
import { useCategoryStore } from "../stores/useCategoryStore";
import { useProductStore } from "../stores/useProductStore";

const ProductAssignment = ({ category, onClose }) => {
	const [selectedProducts, setSelectedProducts] = useState([]);
	const { assignProductsToCategory, loading } = useCategoryStore();
	const { products } = useProductStore();

	useEffect(() => {
		if (category && products) {
			// Pre-select products that already belong to this category
			const categoryProducts = products.filter(product => product.category === category.name);
			setSelectedProducts(categoryProducts.map(p => p._id));
		}
	}, [category, products]);

	const handleProductToggle = (productId) => {
		setSelectedProducts(prev => 
			prev.includes(productId)
				? prev.filter(id => id !== productId)
				: [...prev, productId]
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await assignProductsToCategory(category._id, selectedProducts);
			onClose();
		} catch (error) {
			console.log("Error assigning products:", error);
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
				className='bg-gray-800 rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto'
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
			>
				<div className='flex justify-between items-center mb-6'>
					<h2 className='text-2xl font-semibold text-emerald-300'>
						Assign Products to "{category.name}"
					</h2>
					<button
						onClick={onClose}
						className='text-gray-400 hover:text-white transition-colors'
					>
						<X className='h-6 w-6' />
					</button>
				</div>

				<form onSubmit={handleSubmit}>
					<div className='mb-6'>
						<p className='text-gray-400 text-sm mb-4'>
							Select which products should belong to this category:
						</p>
						
						{products.length === 0 ? (
							<p className='text-gray-400 text-center py-8'>No products available</p>
						) : (
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto'>
								{products.map((product) => (
									<div
										key={product._id}
										className={`p-4 border rounded-lg cursor-pointer transition-colors ${
											selectedProducts.includes(product._id)
												? 'border-emerald-500 bg-emerald-900/20'
												: 'border-gray-600 hover:border-gray-500'
										}`}
										onClick={() => handleProductToggle(product._id)}
									>
										<div className='flex items-center space-x-3'>
											<input
												type='checkbox'
												checked={selectedProducts.includes(product._id)}
												onChange={() => handleProductToggle(product._id)}
												className='h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-600 rounded'
											/>
											<div className='flex-1 min-w-0'>
												<img
													src={product.image}
													alt={product.name}
													className='w-16 h-16 object-cover rounded mb-2'
												/>
												<p className='text-sm font-medium text-white truncate'>
													{product.name}
												</p>
												<p className='text-xs text-gray-400'>
													Current: {product.category}
												</p>
												<p className='text-xs text-emerald-400'>
													${product.price}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					<div className='flex justify-between items-center pt-4 border-t border-gray-700'>
						<p className='text-sm text-gray-400'>
							{selectedProducts.length} product(s) selected
						</p>
						<div className='flex space-x-3'>
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
										Assigning...
									</>
								) : (
									<>
										<Save className='mr-2 h-4 w-4' />
										Assign Products
									</>
								)}
							</button>
						</div>
					</div>
				</form>
			</motion.div>
		</motion.div>
	);
};

export default ProductAssignment;