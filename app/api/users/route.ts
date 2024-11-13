// // app/api/users/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import { hash } from 'bcryptjs';
// import { nanoid } from 'nanoid';
//
// export async function GET(request: NextRequest) {
//     try {
//         const users = await db.select().from('users');
//         return NextResponse.json({ success: true, users });
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         return NextResponse.json(
//             { success: false, error: 'Failed to fetch users' },
//             { status: 500 }
//         );
//     }
// }
//
// export async function POST(request: NextRequest) {
//     try {
//         const { email, password, fullName, user_type } = await request.json();
//
//         // Hash password
//         const hashedPassword = await hash(password, 10);
//
//         // Create user
//         const [user] = await db.insert('users').values({
//             id: nanoid(),
//             email,
//             password: hashedPassword,
//             fullName,
//             user_type,
//         }).returning();
//
//         return NextResponse.json({ success: true, user });
//     } catch (error) {
//         console.error('Error creating user:', error);
//         return NextResponse.json(
//             { success: false, error: 'Failed to create user' },
//             { status: 500 }
//         );
//     }
// }