import "@/css/global.css";
import { Analytics } from "@vercel/analytics/next";
import { Roboto } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";
import Nav from "@/components/layout/nav/Nav";
import Footer from "@/components/layout/footer/Footer";
import { OpenedBoxProvider } from "@/context/OpenedBoxContext";
import { Suspense } from "react";
import Loading from "./loading";
const roboto = Roboto({
    weight: ["900", "700", "500", "400", "300"],
    subsets: ["latin"],
});

export const metadata = {
    title: "Streamura",
    description: "Youtube videos without ads",
    icons: {
        icon: "/icon.png",
        shortcut: "/icon.png",
        apple: "/icon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${roboto.className}`} >
            <Suspense fallback={<Loading />}>
                <AuthProvider>
                    <OpenedBoxProvider>
                        <Nav />
                        {children}
                        <Footer />
                        <Toaster position="top-center" reverseOrder={false} />
                        <Analytics />
                    </OpenedBoxProvider>
                </AuthProvider>
                </Suspense>
            </body>
        </html>
    );
}
