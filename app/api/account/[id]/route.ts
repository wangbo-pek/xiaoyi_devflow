import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

// GET /api/account/[id]
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) throw new NotFoundError("Account");

    try {
        await dbConnect();
        const account = await Account.findById(id);
        if (!account) throw new NotFoundError("Account");
        return NextResponse.json(
            { success: true, data: account },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

// DELETE /api/account/[id]
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if (!id) throw new NotFoundError("Account");

    try {
        await dbConnect();
        const account = await Account.findByIdAndDelete(id);
        if (!account) throw new NotFoundError("Account");
        return NextResponse.json(
            { success: true, data: account },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

// PUT /api/account/[id]
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if (!id) throw new NotFoundError("Account");
    try {
        await dbConnect();
        const body = await request.json();
        const validatedData = AccountSchema.partial().safeParse(body);
        const updateAccount = await Account.findByIdAndUpdate(
            id,
            validatedData,
            {
                new: true,
            }
        );

        if (!updateAccount) throw new NotFoundError("Account");
        return NextResponse.json(
            { success: true, data: updateAccount },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}
