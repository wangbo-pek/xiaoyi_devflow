import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

// POST /api/account/provider
export async function POST(request: Request) {
    const { providerAccountId } = await request.json();

    try {
        await dbConnect();
        const validatedData = AccountSchema.partial().safeParse({
            providerAccountId,
        });
        if (!validatedData.success) {
            const formattedErrors: Record<string, string[]> = {};
            validatedData.error.issues.forEach((issue) => {
                const path = issue.path.join(".");
                if (!formattedErrors[path]) {
                    formattedErrors[path] = [];
                }
                formattedErrors[path].push(issue.message);
            });
            throw new ValidationError(formattedErrors);
        }

        const account = await Account.findOne({ providerAccountId });
        if (!account) throw new Notification("Account");
        return NextResponse.json(
            { success: true, data: account },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}
