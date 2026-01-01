import Leftsidebar from "@/components/navigation/LeftSidebar";
import Navbar from "@/components/navigation/navbar";
import RightSidebar from "@/components/navigation/RightSidebar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="background-light850_dark100 relative">
            <Navbar />
            <div className="flex">
                <Leftsidebar />

                <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-30 max-md:pb-14 sm:px-14">
                    <div className="mx-auto w-full max-w-7xl">
                        {children}
                    </div>
                </section>
                <RightSidebar />
            </div>
        </main>
    );
};

export default RootLayout;
