"use client";
import { SignInSchema } from "@/lib/validation";
import AuthForm from "@/components/forms/AuthForm";

const SignIn = () => {
    return (
        <AuthForm
            formType="SIGN_IN"
            schema={SignInSchema}
            defaultValues={{ email: "", password: "" }}
            onSubmit={(data) => Promise.resolve({ success: true, data })}
        />
    );
};

export default SignIn;
