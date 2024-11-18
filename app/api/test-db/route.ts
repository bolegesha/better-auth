// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        // Test database connection
        const result = await db.$queryRaw`SELECT 1 as test`;
        console.log('Database test result:', result);

        return NextResponse.json({
            success: true,
            message: 'Database connection successful',
            test: result
        });
    } catch (error: unknown) {
        console.error('Database test error:', error);

        // Type guard for Error objects
        let errorMessage = 'An unknown error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
        }

        return NextResponse.json({
            success: false,
            error: 'Database connection failed',
            details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        }, {
            status: 500
        });
    }
}