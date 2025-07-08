import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const EditProductForm = ({ product, onClose }) => {
	const [editProduct, setEditProduct] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		image: "",
		stock: 0,
	});

	const { updateProduct, loading } = useProductStore();

	useEffect(() => {
		if (product) {
			setEditProduct({
				name: product.name,
				description: product.description,
				price: product.price.toString(),
				category: product.category,
				image: product.image,
				stock: product.stock,
			});
		}
	}, [product]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateProduct(product._id, editProduct);
			onClose();
		} catch {
			console.log("error updating product");
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setEditProduct({ ...editProduct, image: reader.result });
			};

			reader.readAsDataURL(file); // base64
		}
	};

	return (
		<motion.div
			className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<motion.div
				className='bg-gray-800 shadow-lg rounded-lg p-8 max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto'
				initial={{ scale: 0.9, y: 20 }}
				animate={{ scale: 1, y: 0 }}
				exit={{ scale: 0.9, y: 20 }}
			>
				<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Edit Product</h2>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
							Product Name
						</label>
						<input
							type='text'
							id='name'
							name='name'
							value={editProduct.name}
							onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
							className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
							 px-3 text-white focus:outline-none focus:ring-2
							focus:ring-emerald-500 focus:border-emerald-500'
							required
						/>
					</div>

					<div>
						<label htmlFor="stock" className="block text-sm font-medium text-gray-300">Stock</label>
						<input
							id="stock"
							name="stock"
							type="number"
							min="0"
							value={editProduct.stock}
							onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0 })}
							className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
							value={editProduct.description}
							onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
							rows='3'
							className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
							 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
							 focus:border-emerald-500'
							required
						/>
					</div>

					<div>
						<label htmlFor='price' className='block text-sm font-medium text-gray-300'>
							Price
						</label>
						<input
							type='number'
							id='price'
							name='price'
							value={editProduct.price}
							onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
							step='0.01'
							className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
							py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
							 focus:border-emerald-500'
							required
						/>
					</div>

					<div>
						<label htmlFor='category' className='block text-sm font-medium text-gray-300'>
							Category
						</label>
						<select
							id='category'
							name='category'
							value={editProduct.category}
							onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
							className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
							 shadow-sm py-2 px-3 text-white focus:outline-none 
							 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
							required
						>
							<option value=''>Select a category</option>
							{categories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-300 mb-2'>
							Product Image
						</label>
						{editProduct.image && (
							<div className='mb-4'>
								<img
									src={editProduct.image}
									alt='Current product'
									className='w-20 h-20 object-cover rounded-md'
								/>
							</div>
						)}
						<div className='flex items-center'>
							<input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
							<label
								htmlFor='image'
								className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
							>
								<Upload className='h-5 w-5 inline-block mr-2' />
								Upload New Image
							</label>
						</div>
					</div>

					<div className='flex gap-4 pt-4'>
						<button
							type='submit'
							className='flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md 
							shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
							focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
									Updating...
								</>
							) : (
								<>
									<Edit className='mr-2 h-5 w-5' />
									Update Product
								</>
							)}
						</button>
						<button
							type='button'
							onClick={onClose}
							className='flex-1 flex justify-center py-2 px-4 border border-gray-600 rounded-md 
							shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 
							focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
						>
							Cancel
						</button>
					</div>
				</form>
			</motion.div>
		</motion.div>
	);
};

export default EditProductForm;