import React, { useEffect, useState } from 'react';
import { User, Shield, CheckCircle, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/users');
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string, userName: string, userRole: string) => {
        if (!confirm(`Are you sure you want to delete ${userName}?`)) return;

        try {
            const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (res.ok) {
                alert('User deleted successfully');
                fetchUsers(); // Refresh the list
            } else {
                alert(data.message || 'Failed to delete user');
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete user');
        }
    };

    const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

        try {
            const res = await fetch(`http://localhost:3001/api/users/${userId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                fetchUsers(); // Refresh the list
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to update user status');
            }
        } catch (err) {
            console.error('Status toggle error:', err);
            alert('Failed to update user status');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-purple-600 text-white p-3 rounded-lg">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500">Manage users and platform overview</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-bold text-xl">All Users ({users.length})</h2>
                        <div className="text-sm text-gray-500">
                            Learners: {users.filter(u => u.role === 'learner').length} |
                            Instructors: {users.filter(u => u.role === 'instructor').length}
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading users...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-sm">
                                    <tr>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Role</th>
                                        <th className="p-4">Location</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-medium flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                    <User size={16} />
                                                </div>
                                                {user.name}
                                            </td>
                                            <td className="p-4 text-gray-600">{user.email}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                                                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                        user.role === 'instructor' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-500">{user.location || '-'}</td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleToggleUserStatus(user.id, user.status || 'active')}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold transition ${(user.status || 'active') === 'active'
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {(user.status || 'active').toUpperCase()}
                                                </button>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id, user.name, user.role)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                                    title="Delete user"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
