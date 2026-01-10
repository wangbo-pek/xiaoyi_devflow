import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import NavLinks from "./navbar/NavLinks";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import { LogOut } from "lucide-react";

const Leftsidebar = async () => {
    const session = await auth();
    const userId = session?.user?.id;

    return (
        <section
            className="custome-scrollbar background-light900_dark200 light-border sticky 
            left-0 top-0 h-screen flex flex-col justify-between overflow-y-auto border-r 
            p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-66.5"
        >
            <div className="flex flex-1 flex-col gap-6">
                <NavLinks userId={userId} />
            </div>

            <div className="flex flex-col gap-3">
                {userId ? (
                    <form
                        action={async () => {
                            "use server";
                            await signOut();
                        }}
                    >
                        <Button
                            type="submit"
                            className="base-medium w-fit bg-transparent! px-4 py-3"
                        >
                            <LogOut className="size-5 text-black dark:text-white" />
                            <span className="text-black dark:text-white max-lg:hidden">
                                LogOut
                            </span>
                        </Button>
                    </form>
                ) : (
                    <>
                        <Button
                            className="small-medium btn-secondary min-h-10 w-full rounded-lg px-4 py-3 shadow-none"
                            asChild
                        >
                            <Link href={ROUTES.SIGN_IN}>
                                <Image
                                    src="/icons/account.svg"
                                    alt="Account"
                                    width={20}
                                    height={20}
                                    className="invert-colors lg:hidden"
                                />
                                <span className="primary-text-gradient max-lg:hidden">
                                    Log In
                                </span>
                            </Link>
                        </Button>

                        <Button
                            className="small-medium light-border-2 text-dark400_light900 btn-tertiary min-h-10 w-full rounded-lg px-4 py-3"
                            asChild
                        >
                            <Link href={ROUTES.SIGN_UP}>
                                <Image
                                    src="/icons/sign-up.svg"
                                    alt="Account"
                                    width={20}
                                    height={20}
                                    className="invert-colors lg:hidden"
                                />
                                <span className="primary-text-gradient max-lg:hidden">
                                    Log Up
                                </span>
                            </Link>
                        </Button>
                    </>
                )}
            </div>
        </section>
    );
};

export default Leftsidebar;
