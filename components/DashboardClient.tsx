'use client'

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { Sidebar } from '@/components/Sidebar';
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserCircle, Settings, Bell, HelpCircle, House, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LogoutButton } from './LogoutButton';

const sidebarItems = [
    {
        icon: House,
        label: 'Главная страница',
        id: 'home'
    },
    { icon: UserCircle, label: 'Личный кабинет', id: 'profile' },
    { icon: Settings, label: 'Настройки', id: 'settings' },
    { icon: Bell, label: 'Заказы', id: 'orders' },
    { icon: HelpCircle, label: 'Помогите', id: 'help' },
    { icon: Calculator, label: 'Калькулятор', id: 'calculator' },
];

interface DashboardClientProps {
    user: {
        name: string;
        email: string;
    };
    isAuthenticated: boolean;
    logoutAction: () => Promise<void>;
}

export function DashboardClient({ user, isAuthenticated, logoutAction }: DashboardClientProps) {
    const [activeSection, setActiveSection] = useState('profile');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();

    const handleSidebarItemClick = (sectionId: string) => {
        if (sectionId === 'home') {
            router.push('/');
        } else if (sectionId === 'calculator') {
            router.push('/calculator');
        } else {
            setActiveSection(sectionId);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F5F5F7]">
            <Sidebar
                items={sidebarItems}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                onItemClick={handleSidebarItemClick}
            />

            <main className="flex-1 p-8">
                <div className="max-w-3xl mx-auto">
                    {activeSection === 'profile' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-semibold text-gray-700">
                                    Профиль
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-[#86868B]">
                                        Имя пользователя
                                    </Label>
                                    <p className="mt-1 text-lg text-gray-700">{user.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-[#86868B]">
                                        Email
                                    </Label>
                                    <p className="mt-1 text-lg text-gray-700">{user.email}</p>
                                </div>

                                <CardContent className="space-y-4">
                                    <div>Your worker-specific content here</div>
                                    <LogoutButton />
                                </CardContent>
                            </CardContent>
                        </Card>
                    )}

                    {/* Add other sections here */}
                </div>
            </main>
        </div>
    );
}