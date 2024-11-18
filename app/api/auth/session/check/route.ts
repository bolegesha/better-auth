import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const sessionToken = request.cookies.get('better-auth.session_token')?.value;

        if (!sessionToken) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        // Extract the actual session ID from the token
        const actualSessionId = sessionToken.split('.')[0];

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

        if (!session) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        return NextResponse.json({
            user: session.user,
            success: true
        });
    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}