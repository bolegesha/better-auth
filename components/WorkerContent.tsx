'use client';

import { useState } from 'react';
import { useUserData } from '@/hooks/UserData';
import { Sidebar } from '@/components/Sidebar';
import { UserCircle, Settings, Calculator, HelpCircle, Trello, ChartBarIncreasing, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from '@/components/LogoutButton';

const sidebarItems = [
    { icon: UserCircle, label: 'Профиль', href: '#profile' },
    { icon: ChartBarIncreasing, label: 'Статистика', href: '#statistics' },
    { icon: Trello, label: 'Заказы', href: '#orders' },
    { icon: FileText, label: 'Счета', href: '#invoices' },
    { icon: Calculator, label: 'Калькулятор', href: '#calculator' },
    { icon: Settings, label: 'Настройки', href: '#settings' },
    { icon: HelpCircle, label: 'Помогите', href: '#help' },
];

export default function WorkerContent() {
    const { user } = useUserData();
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
                            <CardTitle>Worker Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>Your worker-specific content here</div>
                            <LogoutButton />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}