import { NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";

const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    role: z.enum(['ADMIN', 'WORKER', 'BASIC_USER'])
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Creating user:', {
            ...body,
            password: '[REDACTED]'
        });

        const validationResult = createUserSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json({
                error: validationResult.error.errors[0].message
            }, { status: 400 });
        }

        const { email, password, name, role } = validationResult.data;

        // First create user with better-auth
        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
            callbackURL: undefined,
        });

        if (error) {
            console.log('SignUp error:', error);
            return NextResponse.json({
                error: error.message
            }, { status: 400 });
        }

        // Then update the user's role in the database
        if (data?.user) {
            const updatedUser = await db.user.update({
                where: { id: data.user.id },
                data: { role },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    emailVerified: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            return NextResponse.json({
                user: updatedUser,
                message: 'User created successfully'
            });
        }

        throw new Error('Failed to create user');

    } catch (error) {
        console.error('Error in user creation:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Failed to create user'
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const users = await db.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                Account: {
                    select: {
                        providerId: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            users: users.map(user => ({
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString()
            }))
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}