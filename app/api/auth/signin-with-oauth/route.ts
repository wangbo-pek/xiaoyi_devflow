import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(request: Request) {
    const { provider, providerAccountId, user } = await request.json();
    await dbConnect();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const validatedData = SignInWithOAuthSchema.safeParse({
            provider,
            providerAccountId,
            user,
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

        const { name, username, email, image } = user;
        const slugifiedUsername = slugify(username, {
            lower: true,
            strict: true,
            trim: true,
        });

        let existingUser = await User.findOne({ email }).session(session);
        if (!existingUser) {
            [existingUser] = await User.create(
                [{ name, username, slugifiedUsername, email, image }],
                { session }
            );
        } else {
            const updateData: { name?: string; image?: string } = {};
            if (existingUser.name !== name) updateData.name = name;
            if (existingUser.image !== image) updateData.image = image;

            if (Object.keys(updateData).length > 0) {
                await User.updateOne(
                    { _id: existingUser.id },
                    { $set: updateData }
                ).session(session);
            }
        }

        const existingAccount = await Account.findOne({
            userId: existingUser._id,
            provider,
            providerAccountId,
        }).session(session);

        if (!existingAccount) {
            await Account.create(
                [
                    {
                        userId: existingUser._id,
                        name,
                        image,
                        provider,
                        providerAccountId,
                    },
                ],
                { session }
            );
        }

        await session.commitTransaction();
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        await session.abortTransaction();
        return handleError(error, "api") as APIErrorResponse;
    } finally {
        session.endSession();
    }
}
