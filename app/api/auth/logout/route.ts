// app/api/auth/logout/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { PrismaClient } from '@prisma/client';

// Create a new Prisma instance for this request
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    console.group('📝 Auth POST Request - Logout');

    try {
        const sessionToken = request.cookies.get('better-auth.session_token')?.value;
        console.log('Processing logout for session:', sessionToken);

        if (sessionToken) {
            const actualSessionId = sessionToken.split('.')[0];

            try {
                await prisma.$connect();

                await prisma.session.deleteMany({
                    where: {
                        id: actualSessionId
                    }
                });
            } catch (dbError) {
                console.error('Database operation failed:', dbError);
                // Continue with cookie clearing even if DB operation fails
            } finally {
                await prisma.$disconnect();
            }
        }

        // Always clear the cookie, even if DB operation fails
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Set-Cookie': 'better-auth.session_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
        });

        console.log('Sending success response');
        console.groupEnd();

        return new Response(
            JSON.stringify({ success: true }),
            {
                status: 200,
                headers
            }
        );

    } catch (error) {
        console.error('Logout error:', error);
        console.groupEnd();

        try {
            await prisma.$disconnect();
        } catch {}

        return new Response(
            JSON.stringify({ success: false, error: 'Logout failed' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}