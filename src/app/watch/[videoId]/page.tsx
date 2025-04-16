import UrlSearch from "@/components/UrlSearch";
import React from "react";
export const dynamic = "force-dynamic";
import styles from "@/css/VideoPage.module.css";
import QuerySearch from "@/components/QuerySearch";
import { Metadata } from "next";
type Data = {
    id: string;
    description: string;
    channelTitle: string;
    title: string;
    date: string;
    viewCount: number;
};
type Props = {
    params: Promise<{ videoId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export async function generateMetadata({
    params,
    searchParams,
}: Props): Promise<Metadata> {
    const { videoId } = await params;
    const param = await searchParams;
    const title = param.title === "string" ? param.title : "Clean Youtube";

    return {
        title: title,
        openGraph: {
            title: title,
            images: [
                {
                    url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                    width: 1280,
                    height: 720,
                },
            ],
        },
    };
}
function formatDate(dateString: string): string {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
}
function formatNumberWithCommas(number: number) {
    return new Intl.NumberFormat("en-US").format(number);
}

export default async function Page({
    params,
}: {
    params: Promise<{ videoId: string }>;
}) {
    const videoId = (await params).videoId;
    const res = await fetch(
        `http://localhost:3000/api/getVideo?videoId=${videoId}`
    );
    const jsonRes = await res.json();
    const data = jsonRes.data[0] as Data;
    return (
        <div>
            <UrlSearch />
            <QuerySearch />
            <iframe
                width="100%"
                height="480px"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allowFullScreen
                style={{
                    display: "block",
                    margin: "10px auto",
                    backgroundColor: "#000",
                    border: "none",
                    borderRadius: "8px", // Optional for slightly rounded edges
                    maxWidth: "1280px", // Limit maximum width like YouTube theater mode
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)", // Add some shadow for a floating effect
                }}
            ></iframe>

            <div className={styles.videoDetails}>
                <h1 className={styles.title}>{data.title}</h1>
                <h2 className={styles.channelTitle}>{data.channelTitle}</h2>
                <div className={styles.meta}>
                    <span className={styles.views}>
                        {formatNumberWithCommas(data.viewCount)} views
                    </span>
                    <span className={styles.date}>{formatDate(data.date)}</span>
                </div>
                <pre className={styles.description}>{data.description}</pre>
            </div>
        </div>
    );
}
