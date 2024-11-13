'use client';

import { useState, useEffect } from 'react';
import { useUserData } from '@/hooks/UserData';
import { Sidebar } from '@/components/Sidebar';
import { UserCircle, Settings, Bell, HelpCircle, Users, Gauge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type UserType = 'admin' | 'worker' | 'user';

interface User {
    id: string;
    email: string;
    fullName: string;
    user_type: UserType;
}

const sidebarItems = [
    { icon: Gauge, label: 'Статистика', href: '#profile' },
    { icon: Users, label: 'Пользователи', href: '#users' },
    { icon: UserCircle, label: 'Профиль', href: '#profile' },
    { icon: Settings, label: 'Настройки', href: '#settings' },
    { icon: Bell, label: 'Уведомления', href: '#notifications' },
    { icon: HelpCircle, label: 'Помогите', href: '#help' }
];

export default function AdminContent() {
    const { user, loading, error, logout } = useUserData();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState('profile');
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [userList, setUserList] = useState<User[]>([]);
    const [formError, setFormError] = useState<string | null>(null);

    // Fetch users when component mounts and when activeSection changes to 'users'
    useEffect(() => {
        if (activeSection === 'users') {
            fetchUsers();
        }
    }, [activeSection]);



    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to fetch users');

            const data = await response.json();
            setUserList(data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast({
                title: "Error",
                description: "Failed to fetch users",
                variant: "destructive",
            });
        }
    };

    const handleUserRegistration = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.get('email'),
                    password: formData.get('password'),
                    fullName: formData.get('name'),
                    user_type: formData.get('user_type'),
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create user');
            }

            await fetchUsers();
            setIsAddingUser(false);
            form.reset();
            toast({
                title: "Success",
                description: "User created successfully",
            });
        } catch (error) {
            console.error('Error creating user:', error);
            setFormError(error instanceof Error ? error.message : 'Failed to create user');
            toast({
                title: "Error",
                description: "Failed to create user",
                variant: "destructive",
            });
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            await fetchUsers();
            toast({
                title: "Success",
                description: "User deleted successfully",
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            toast({
                title: "Error",
                description: "Failed to delete user",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar
                items={sidebarItems}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                onItemClick={setActiveSection}
            />

            <main className="flex-1 bg-white">
                <div className="max-w-4xl w-full mx-auto p-8">
                    {/* User Management Section */}
                    {activeSection === 'users' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-semibold text-[#1D1D1F]">Управление людьми</h1>
                                <Button
                                    onClick={() => setIsAddingUser(!isAddingUser)}
                                    className="bg-[#00358E] text-white"
                                >
                                    {isAddingUser ? 'Cancel' : 'Add New User'}
                                </Button>
                            </div>

                            {/* User Registration Form */}
                            {isAddingUser && (
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h2 className="text-xl font-semibold mb-4">Создать аккаунт</h2>
                                    {formError && (
                                        <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
                                            {formError}
                                        </div>
                                    )}
                                    <form onSubmit={handleUserRegistration} className="space-y-4">
                                        <div>
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                required
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="user_type">User Type</Label>
                                            <select
                                                id="user_type"
                                                name="user_type"
                                                required
                                                className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:border-transparent"
                                            >
                                                <option value="user">Клиент</option>
                                                <option value="worker">Работника</option>
                                                <option value="admin">Администратор</option>
                                            </select>
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full bg-[#00358E] text-white"
                                        >
                                            Создать пользователя
                                        </Button>
                                    </form>
                                </div>
                            )}

                            {/* User List Table */}
                            <div className="bg-white rounded-lg border">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {userList.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.fullName}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                            ${user.user_type === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                            user.user_type === 'worker' ? 'bg-green-100 text-green-800' :
                                                                'bg-blue-100 text-blue-800'}`}>
                                                            {user.user_type}
                                                        </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Button
                                                        variant="ghost"
                                                        className="bg-red-500 text-white hover:bg-red-800"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Profile Section */}
                    {activeSection === 'profile' && (
                        <div className="space-y-4">
                            <h1 className="text-2xl font-semibold text-[#1D1D1F]">Admin Profile</h1>
                            <div>
                                <label className="block text-sm font-medium text-[#86868B]">Имя</label>
                                <p className="mt-1 text-lg text-[#1D1D1F]">{user?.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#86868B]">Email</label>
                                <p className="mt-1 text-lg text-[#1D1D1F]">{user?.email}</p>
                            </div>
                            <Button
                                onClick={logout}
                                className="mt-8 bg-[#D1350F] text-white hover:bg-red-400"
                            >
                                Выйти
                            </Button>
                        </div>
                    )}

                    {/* Other sections */}
                    {activeSection === 'settings' && (
                        <div className="space-y-4">
                            <h1 className="text-2xl font-semibold text-[#1D1D1F]">Настройки</h1>
                        </div>
                    )}

                    {activeSection === 'notifications' && (
                        <div className="space-y-4">
                            <h1 className="text-2xl font-semibold text-[#1D1D1F]">Уведомления</h1>
                        </div>
                    )}

                    {activeSection === 'help' && (
                        <div className="space-y-4">
                            <h1 className="text-2xl font-semibold text-[#1D1D1F]">Помогите</h1>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}