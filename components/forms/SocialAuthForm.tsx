"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import ROUTES from "@/constants/routes";
import { signIn } from "next-auth/react";

const SocialAuthForm = () => {
    const buttonClassName =
        "background-dark400_light900 body-medium text-dark200_light800 rounded-2 min-h-12 flex-1 px-4 py-3 cursor-pointer";

    const handleSignIn = async (provider: "github" | "google") => {
        try {
            await signIn(provider, {
                callbackUrl: ROUTES.HOME,
                redirect: true,
            });
        } catch (error) {
            console.log(error);
            toast.error("Sign-In Failed", {
                description:
                    error instanceof Error
                        ? error.message
                        : "An error occured during sign-in",
                duration: 5000,
                position: "top-right",
            });
        }
    };

    return (
        <div className="mt-10 flex flex-wrap gap-2.5">
            <Button
                className={buttonClassName}
                onClick={() => {
                    handleSignIn("github");
                }}
            >
                <Image
                    src="/icons/github.svg"
                    alt="GitHub Logo"
                    width={20}
                    height={20}
                    className="invert-colors mr-2.5 object-contain"
                />
                <span>Log in with GitHub</span>
            </Button>

            <Button
                className={buttonClassName}
                onClick={() => {
                    handleSignIn("google");
                }}
            >
                <Image
                    src="/icons/google.svg"
                    alt="Google Logo"
                    width={20}
                    height={20}
                    className="mr-2.5 object-contain"
                />
                <span>Log in with Google</span>
            </Button>
        </div>
    );
};

export default SocialAuthForm;
