import { NextResponse } from 'next/server';
import { db } from "@/lib/db";

type Params = Promise<{ id: string }>;

export async function DELETE(
    req: Request,
    { params }: { params: Params }
) {
    const { id } = await params;

    try {
        const deletedUser = await db.user.delete({
            where: { id }
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