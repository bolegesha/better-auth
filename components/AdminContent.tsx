'use client';

import { useState } from 'react';
import { useUserData } from '@/hooks/UserData';
import { Sidebar } from '@/components/Sidebar';
import { UserCircle, Settings, Bell, HelpCircle, Users, Gauge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from '@/components/LogoutButton';

const sidebarItems = [
    { icon: Gauge, label: 'Статистика', href: '#profile' },
    { icon: Users, label: 'Пользователи', href: '#users' },
    { icon: UserCircle, label: 'Профиль', href: '#profile' },
    { icon: Settings, label: 'Настройки', href: '#settings' },
    { icon: Bell, label: 'Уведомления', href: '#notifications' },
    { icon: HelpCircle, label: 'Помогите', href: '#help' }
];

export default function AdminContent() {
    const { user, logout } = useUserData();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState('profile');

    return (
        <div className="flex min-h-screen bg-[#F5F5F7]">
            <Sidebar
                items={sidebarItems}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                onItemClick={setActiveSection}
            />

            <main className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>Your admin-specific content here</div>
                            <LogoutButton onLogout={logout} />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}