import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, List, Users } from "lucide-react";
import { useCategoryStore } from "../stores/useCategoryStore";
import { useProductStore } from "../stores/useProductStore";
import CreateCategoryForm from "./CreateCategoryForm";
import CategoriesList from "./CategoriesList";
import EditCategoryForm from "./EditCategoryForm";
import ProductAssignment from "./ProductAssignment";

const CategoryManagement = () => {
	const [activeView, setActiveView] = useState("list");
	const [editingCategory, setEditingCategory] = useState(null);
	const [assigningProducts, setAssigningProducts] = useState(null);
	const { getAllCategories } = useCategoryStore();
	const { fetchAllProducts } = useProductStore();

	useEffect(() => {
		getAllCategories();
		fetchAllProducts();
	}, [getAllCategories, fetchAllProducts]);

	const handleEditCategory = (category) => {
		setEditingCategory(category);
	};

	const handleAssignProducts = (category) => {
		setAssigningProducts(category);
	};

	return (
		<div className='space-y-8'>
			{/* Tab Navigation */}
			<div className='flex justify-center space-x-4'>
				<button
					onClick={() => setActiveView("list")}
					className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
						activeView === "list"
							? "bg-emerald-600 text-white"
							: "bg-gray-700 text-gray-300 hover:bg-gray-600"
					}`}
				>
					<List className='mr-2 h-5 w-5' />
					View Categories
				</button>
				<button
					onClick={() => setActiveView("create")}
					className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
						activeView === "create"
							? "bg-emerald-600 text-white"
							: "bg-gray-700 text-gray-300 hover:bg-gray-600"
					}`}
				>
					<PlusCircle className='mr-2 h-5 w-5' />
					Create Category
				</button>
			</div>

			{/* Content */}
			<motion.div
				key={activeView}
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.3 }}
			>
				{activeView === "list" && (
					<div className='space-y-4'>
						<CategoriesList 
							onEditCategory={handleEditCategory}
							onAssignProducts={handleAssignProducts}
						/>
						<div className='text-center'>
							<button
								onClick={() => setActiveView("create")}
								className='inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-200'
							>
								<PlusCircle className='mr-2 h-5 w-5' />
								Create New Category
							</button>
						</div>
					</div>
				)}

				{activeView === "create" && (
					<CreateCategoryForm />
				)}
			</motion.div>

			{/* Category Actions */}
			<motion.div
				className='bg-gray-800 shadow-lg rounded-lg p-6'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				<h3 className='text-xl font-semibold mb-4 text-emerald-300'>Category Actions</h3>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<button
						onClick={() => setActiveView("list")}
						className='flex items-center justify-center px-4 py-3 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors duration-200'
					>
						<List className='mr-2 h-5 w-5' />
						Manage Categories
					</button>
					<button
						onClick={() => {
							// This would open a modal to assign products to categories
							// For now, we'll just show a message
							alert("Select a category from the list to assign products to it");
						}}
						className='flex items-center justify-center px-4 py-3 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors duration-200'
					>
						<Users className='mr-2 h-5 w-5' />
						Assign Products
					</button>
				</div>
			</motion.div>

			{/* Modals */}
			{editingCategory && (
				<EditCategoryForm
					category={editingCategory}
					onClose={() => setEditingCategory(null)}
				/>
			)}

			{assigningProducts && (
				<ProductAssignment
					category={assigningProducts}
					onClose={() => setAssigningProducts(null)}
				/>
			)}
		</div>
	);
};

export default CategoryManagement;