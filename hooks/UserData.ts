import { useEffect, useState, useCallback } from 'react';
import type { User } from '@/types';

export function useUserData() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const checkSession = async () => {
        try {
            const response = await fetch('/api/auth/session/check', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setUser(null);
                    setLoading(false);
                    return;
                }
                throw new Error(`Session check failed: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.user) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error('Session check error:', err);
            setError(err instanceof Error ? err.message : 'Failed to check session');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = useCallback(async () => {
        try {
            setLoading(true);
            console.log('Starting logout...');

            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });

            console.log('Logout response status:', response.status);

            let success = false;
            try {
                const data = await response.json();
                success = data.success;
                console.log('Logout response data:', data);
            } catch (e) {
                console.log('Could not parse response JSON');
            }

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            // Clear user state
            setUser(null);
            console.log('User state cleared');

            // Force a clean reload to the sign-in page
            window.location.replace('/sign-in');
        } catch (err) {
            console.error('Logout error:', err);
            setError(err instanceof Error ? err.message : 'Failed to logout');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkSession();
    }, []);

    return { user, loading, error, logout };
}