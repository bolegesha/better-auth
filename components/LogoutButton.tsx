// components/LogoutButton.tsx
'use client';

import { Button } from "./ui/button";
import { useState } from "react";

export function LogoutButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });

            // Don't try to parse JSON if something went wrong
            if (response.ok) {
                // Force a clean reload to the sign-in page
                window.location.href = '/sign-in';
            } else {
                console.error('Logout failed with status:', response.status);
                // Fallback: still try to redirect
                window.location.href = '/sign-in';
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Fallback: still try to redirect
            window.location.href = '/sign-in';
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogout}>
            <Button className="bg-red-500 hover:bg-red-600" type="submit" disabled={isLoading}>
                {isLoading ? 'Logging out...' : 'Sign Out'}
            </Button>
        </form>
    );
}