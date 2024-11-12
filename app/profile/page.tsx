// app/profile/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/hooks/UserData';
import { Role } from '@/types';
import AdminContent from '@/components/AdminContent';
import WorkerContent from '@/components/WorkerContent';
import UserContent from '@/components/UserContent';

export default function ProfilePage() {
    const { user, loading, error } = useUserData();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/sign-in');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    switch (user.role) {
        case Role.ADMIN:
            return <AdminContent />;
        case Role.WORKER:
            return <WorkerContent />;
        case Role.BASIC_USER:
            return <UserContent />;
        default:
            return <div>Invalid user role</div>;
    }
}