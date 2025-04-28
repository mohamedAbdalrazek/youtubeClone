
import "@/css/global.css";
import { Analytics } from "@vercel/analytics/next";
import { Roboto } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";
import Nav from "@/components/refactor/Nav";
import Footer from "@/components/refactor/Footer";
const roboto = Roboto({
    weight: ["900", "700", "500", "400", "300"],
    subsets: ["latin"],
});

export const metadata = {
    title: "Streamura",
    description: "Youtube videos without ads",
    icons: {
        icon: "/icon.png", // Path to your favicon file
        shortcut: "/icon.png",
        apple: "/icon.png", // Optional for Apple devices
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${roboto.className}`}>
                <AuthProvider>
                    {/* <div
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                            gap: "10px",
                            borderBottom: " 1px solid var(--border-color)",
                            alignItems: "center",
                            padding: "0 20px",
                        }}
                    >
                        <QuerySearch />
                        <UrlSearch />
                        <SignInButton />
                    </div> */}
                    <Nav />
                    {children}
                    <Footer />
                    <Toaster position="top-center" reverseOrder={false} />

                    <Analytics />
                </AuthProvider>
            </body>
        </html>
    );
}
