import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { User, UserRole } from '../../types.ts';

const UserManagement: React.FC = () => {
    const { users, addUser } = useApp();
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: UserRole.STUDENT, avatarUrl: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (newUser.name && newUser.email) {
            addUser({
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                avatarUrl: newUser.avatarUrl || `https://picsum.photos/seed/${newUser.name.split(' ').join('')}/100`
            });
            setShowAddUserModal(false);
            setNewUser({ name: '', email: '', role: UserRole.STUDENT, avatarUrl: '' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-dark-text">User Management</h1>
                <button
                    onClick={() => setShowAddUserModal(true)}
                    className="px-4 py-2 bg-brand-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Add User
                </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-medium-text uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-medium-text uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-medium-text uppercase tracking-wider">Role</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt={user.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-dark-text">{user.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-medium-text">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                                        {user.role.toLowerCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {/* Edit/Delete functionality can be added here */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {showAddUserModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6 text-dark-text">Add New User</h2>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-medium-text mb-1">Full Name</label>
                                <input type="text" name="name" id="name" value={newUser.name} onChange={handleInputChange} className="w-full bg-gray-50 text-dark-text p-2 rounded-md border border-gray-300" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-medium-text mb-1">Email</label>
                                <input type="email" name="email" id="email" value={newUser.email} onChange={handleInputChange} className="w-full bg-gray-50 text-dark-text p-2 rounded-md border border-gray-300" required />
                            </div>
                             <div>
                                <label htmlFor="avatarUrl" className="block text-sm font-medium text-medium-text mb-1">Avatar URL (Optional)</label>
                                <input type="text" name="avatarUrl" id="avatarUrl" value={newUser.avatarUrl} onChange={handleInputChange} className="w-full bg-gray-50 text-dark-text p-2 rounded-md border border-gray-300" placeholder="https://example.com/image.png"/>
                            </div>
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-medium-text mb-1">Role</label>
                                <select name="role" id="role" value={newUser.role} onChange={handleInputChange} className="w-full bg-gray-50 text-dark-text p-2 rounded-md border border-gray-300">
                                    <option value={UserRole.STUDENT}>Student</option>
                                    <option value={UserRole.INSTRUCTOR}>Instructor</option>
                                    <option value={UserRole.ADMIN}>Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end pt-4 space-x-3">
                                <button type="button" onClick={() => setShowAddUserModal(false)} className="px-4 py-2 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-brand-accent text-white font-semibold rounded-lg hover:opacity-90">Add User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;