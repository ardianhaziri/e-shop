import { motion } from "framer-motion";
import { Edit, Mail, User, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserManagementStore } from "../stores/useUserManagementStore";
import UserEditModal from "./UserEditModal";

const UsersTab = () => {
	const { users, loading, fetchAllUsers } = useUserManagementStore();
	const [selectedUser, setSelectedUser] = useState(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	useEffect(() => {
		fetchAllUsers();
	}, [fetchAllUsers]);

	const handleEditUser = (user) => {
		setSelectedUser(user);
		setIsEditModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsEditModalOpen(false);
		setSelectedUser(null);
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString();
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
			</div>
		);
	}

	return (
		<>
			<motion.div
				className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-6xl mx-auto'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<div className="px-6 py-4 bg-gray-700">
					<h2 className="text-xl font-semibold text-white">User Management</h2>
					<p className="text-gray-300 text-sm">Manage all registered users</p>
				</div>
				
				<table className='min-w-full divide-y divide-gray-700'>
					<thead className='bg-gray-700'>
						<tr>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
							>
								User
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
							>
								Email
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
							>
								Role
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
							>
								Joined
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
							>
								Actions
							</th>
						</tr>
					</thead>

					<tbody className='bg-gray-800 divide-y divide-gray-700'>
						{users?.map((user) => (
							<tr key={user._id} className='hover:bg-gray-700'>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										<div className='flex-shrink-0 h-10 w-10'>
											<div className='h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center'>
												<User className='h-5 w-5 text-white' />
											</div>
										</div>
										<div className='ml-4'>
											<div className='text-sm font-medium text-white'>{user.name}</div>
										</div>
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center text-sm text-gray-300'>
										<Mail className='h-4 w-4 mr-2' />
										{user.email}
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
										user.role === 'admin' 
											? 'bg-purple-100 text-purple-800' 
											: 'bg-green-100 text-green-800'
									}`}>
										{user.role === 'admin' && <Shield className='h-3 w-3 mr-1' />}
										{user.role}
									</span>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>
										{formatDate(user.createdAt)}
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
									<button
										onClick={() => handleEditUser(user)}
										className='text-emerald-400 hover:text-emerald-300 transition-colors duration-200'
									>
										<Edit className='h-5 w-5' />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{users?.length === 0 && (
					<div className="text-center py-12">
						<User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<p className="text-gray-400">No users found</p>
					</div>
				)}
			</motion.div>

			<UserEditModal
				isOpen={isEditModalOpen}
				onClose={handleCloseModal}
				user={selectedUser}
			/>
		</>
	);
};

export default UsersTab;