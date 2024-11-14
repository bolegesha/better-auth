import { NextResponse } from 'next/server';
import { db } from "@/lib/db";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Using cascading delete as defined in your schema
        const deletedUser = await db.user.delete({
            where: { id: params.id }
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