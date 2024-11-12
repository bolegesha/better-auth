import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from "@/lib/db";

const handler = toNextJsHandler(auth.handler);

async function verifySession(sessionToken: string) {
  if (!sessionToken) return null;
  
  try {
    console.log('Verifying session token:', sessionToken);
    
    // Extract the actual session ID from the token
    const actualSessionId = sessionToken.split('.')[0];
    console.log('Extracted session ID:', actualSessionId);

    const session = await db.session.findUnique({
      where: {
        id: actualSessionId,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            name: true,
            createdAt: true,
            updatedAt: true
          }
        }
      },
    });

    console.log('Verify session result:', session);
    return session;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

export const POST = async (...args: Parameters<typeof handler.POST>) => {
    const [req] = args;
    console.group('📝 Auth POST Request');
    console.log('URL:', req.url);
    console.log('Method:', req.method);

    try {
        const url = new URL(req.url);
        
        // Handle session verification
        if (url.pathname.endsWith('/verify')) {
            const body = await req.json();
            console.log('Verify request body:', body);
            const session = await verifySession(body.sessionToken);
            return NextResponse.json({ 
              session,
              success: !!session,
              user: session?.user 
            });
        }

        // Handle normal auth flow
        console.log('🔍 Starting auth process...');
        const response = await handler.POST(...args);
        const data = await response.json();
        
        // Store the session token after successful auth
        if (data.session?.id) {
            const cookieStore = await cookies();
            const sessionToken = data.session.id;
            cookieStore.set('better-auth.session_token', sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });
        }
        
        console.log('Auth response data:', data);
        
        return NextResponse.json({
            ...data,
            success: true
        });
    } catch (error) {
        console.error('❌ Auth error:', error);
        console.groupEnd();
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
};

export const GET = handler.GET;