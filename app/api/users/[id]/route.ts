import { type NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { db } from "@/lib/db";

export async function DELETE(
    request: NextRequest,
    context: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const deletedUser = await db.user.delete({
            where: { id: context.params.id }
        });

        if (!deletedUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}