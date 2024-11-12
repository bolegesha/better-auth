import { useEffect, useState } from 'react';
import type { User } from '@/types';

export function useUserData() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('/api/auth/session/check', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        // Unauthorized - no valid session
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

        checkSession();
    }, []);

    return { user, loading, error };
}