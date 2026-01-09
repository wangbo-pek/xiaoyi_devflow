"use client";
import { SignUpSchema } from "@/lib/validation";
import AuthForm from "@/components/forms/AuthForm";
import { signUpWithCredentials } from "@/lib/actions/auth.action";

const SignUp = () => {
    return (
        <AuthForm
            formType="SIGN_UP"
            schema={SignUpSchema}
            defaultValues={{ email: "", password: "", name: "", username: "" }}
            onSubmit={signUpWithCredentials}
        />
    );
};

export default SignUp;
