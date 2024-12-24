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
            <body className={`${roboto.className}`}>{children}</body>
        </html>
    );
}
