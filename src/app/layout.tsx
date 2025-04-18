import QuerySearch from "@/components/QuerySearch";
import UrlSearch from "@/components/UrlSearch";
import "@/css/global.css";
import { Roboto } from "next/font/google";
const roboto = Roboto({
    weight: ["900", "700", "500", "400", "300"],
    subsets: ["latin"],
});

export const metadata = {
    title: "Clean Youtube",
    description: "Youtube videos without ads",
    icons: {
        icon: "/logo.png", // Path to your favicon file
        shortcut: "/logo.png",
        apple: "/logo.png", // Optional for Apple devices
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
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                        border: " 1px solid var(--border-color)",
                        alignItems:"center",
                        padding:"0 20px"
                    }}
                >   
                    
                    <QuerySearch />
                    <UrlSearch />
                    <div style={{
                        width:"20% "
                    }} >
                        Login
                    </div>
                </div>

                {children}
            </body>
        </html>
    );
}
