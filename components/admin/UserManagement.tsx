import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

const UserManagement: React.FC = () => {
    const { users, addUser } = useApp();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.STUDENT);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name || !email) return;

        addUser({
            name,
            email,
            role,
            avatarUrl: `https://picsum.photos/seed/${name.split(' ')[0]}/100`,
        });

        // Reset form
        setName('');
        setEmail('');
        setRole(UserRole.STUDENT);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-dark-text">User Management</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add User Form */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg border border-gray-200 shadow-md h-fit">
                    <h2 className="text-xl font-semibold mb-4 text-dark-text">Create New User</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-medium-text mb-1">Full Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 text-dark-text p-2 rounded-md border border-gray-300 focus:ring-brand-secondary focus:border-brand-secondary" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-medium-text mb-1">Email</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-50 text-dark-text p-2 rounded-md border border-gray-300 focus:ring-brand-secondary focus:border-brand-secondary" required />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-medium-text mb-1">Role</label>
                            <select id="role" value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full bg-gray-50 text-dark-text p-2 rounded-md border border-gray-300 focus:ring-brand-secondary focus:border-brand-secondary">
                                <option value={UserRole.STUDENT}>Student</option>
                                <option value={UserRole.INSTRUCTOR}>Instructor</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-brand-accent text-white font-semibold p-2 rounded-md hover:opacity-90 transition-opacity">Add User</button>
                    </form>
                </div>
                {/* Users List */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-md">
                    <h2 className="text-xl font-semibold p-6 text-dark-text">All Users</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-200">
                                <tr>
                                    <th className="p-4 font-semibold text-dark-text">Name</th>
                                    <th className="p-4 font-semibold text-dark-text">Email</th>
                                    <th className="p-4 font-semibold text-dark-text">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                                        <td className="p-4 flex items-center text-dark-text">
                                            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full mr-3"/>
                                            {user.name}
                                        </td>
                                        <td className="p-4 text-medium-text">{user.email}</td>
                                        <td className="p-4"><span className={`px-2 py-1 text-xs rounded-full font-semibold capitalize ${user.role === UserRole.ADMIN ? 'bg-red-100 text-red-800' : user.role === UserRole.INSTRUCTOR ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{user.role.toLowerCase()}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;