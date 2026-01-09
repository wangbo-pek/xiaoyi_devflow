"use server";

import { ZodError, ZodType } from "zod";
import { UnauthorizedError, ValidationError } from "../http-errors";
import { Session } from "next-auth";
import { auth } from "@/auth";
import dbConnect from "../mongoose";

type ActionOptions<T> = {
    params?: T;
    schema: ZodType<T>;
    authorize?: boolean;
};

// 1. 检查 params 是否符合schema
// 2. 检查是否授权
// 3. 连接数据库
// 4. 返回 params 和session

async function action<T>({
    params,
    schema,
    authorize = false,
}: ActionOptions<T>) {
    if (schema && params) {
        try {
            schema.parse(params);
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors: Record<string, string[]> = {};
                error.issues.forEach((issue) => {
                    const path = issue.path.join(".");
                    if (!formattedErrors[path]) {
                        formattedErrors[path] = [];
                    }
                    formattedErrors[path].push(issue.message);
                });
                throw new ValidationError(formattedErrors);
            } else {
                return new Error("Schema validation failed");
            }
        }
    }

    let session: Session | null = null;
    if (authorize) {
        session = await auth();
        if (!session) {
            throw new UnauthorizedError();
        }
    }
    await dbConnect();

    return { params, session };
}

export default action;
