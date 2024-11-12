'use client'

import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
    onLogout: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
    return (
        <form action={onLogout}>
            <Button className="bg-red-500 hover:bg-red-700 transition-colors duration-200" type='submit'>
                Sign Out
            </Button>
        </form>
    );
}