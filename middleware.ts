// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    console.log('🔒 Middleware Check');
    
    // Skip auth routes
    if (request.nextUrl.pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }
    
    let session;
    try {
        const sessionToken = request.cookies.get('better-auth.session_token')?.value;
        console.log('Session token:', sessionToken);
        
        if (sessionToken) {
            const response = await fetch(new URL('/api/auth/verify', request.url).toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionToken }),
            });

            const data = await response.json();
            console.log('Session verification response:', data);

            if (data.success && data.session) {
                session = data.session;
                console.log('Valid session found:', {
                    userId: session.user.id,
                    role: session.user.role
                });
            }
        }
    } catch (error) {
        console.error('❌ Middleware error:', error);
    }

    const { pathname } = request.nextUrl;

    // Protected routes check
    if (!session?.user) {
        if (
            pathname.startsWith('/profile') ||
            pathname.startsWith('/admin') ||
            pathname.startsWith('/worker-profile')
        ) {
            console.log('🚫 Access denied - No valid session');
            const redirectUrl = new URL('/sign-in', request.url);
            redirectUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
            return NextResponse.redirect(redirectUrl);
        }
    }

    // Role-based access control
    if (session?.user) {
        // Redirect signed-in users away from auth pages
        if (pathname === '/sign-in' || pathname === '/sign-up') {
            return NextResponse.redirect(new URL('/profile', request.url));
        }

        if (pathname.startsWith('/admin') && session.user.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/profile', request.url));
        }

        if (pathname.startsWith('/worker-profile') && session.user.role !== 'WORKER') {
            return NextResponse.redirect(new URL('/profile', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/profile/:path*',
        '/admin/:path*',
        '/worker-profile/:path*',
        '/sign-in',
        '/sign-up',
        '/api/auth/:path*'
    ]
}