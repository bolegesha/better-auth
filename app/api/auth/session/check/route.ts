import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('📝 Auth POST Request');
        console.log('  Verify request body:', body);

        const { sessionToken } = body;
        console.log('  Verifying session token:', sessionToken);

        if (!sessionToken) {
            return NextResponse.json({
                success: false,
                error: "No session token provided"
            });
        }

        // Extract the session ID from the token
        const sessionId = sessionToken;
        console.log('  Extracted session ID:', sessionId);

        const session = await db.session.findUnique({
            where: {
                id: sessionId,
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

        console.log('  Verify session result:', session);

        if (!session) {
            return NextResponse.json({
                success: false,
                error: "Invalid or expired session"
            });
        }

        return NextResponse.json({
            success: true,
            session: session,
            user: session.user
        });

    } catch (error) {
        console.error("Verify session error:", error);
        return NextResponse.json({
            success: false,
            error: "Internal server error"
        }, {
            status: 500
        });
    }
}