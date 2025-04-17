"use client";
import React, { useEffect, useState } from "react";
export const dynamic = "force-dynamic";
import styles from "@/css/VideoPage.module.css";
import { formatDate, formatNumberWithCommas } from "@/utils/utils";
import VideoPageSkeleton from "@/components/VideoPageSkeleton";
type Data = {
    id: string;
    description: string;
    channelTitle: string;
    title: string;
    date: string;
    viewCount: number;
};
export default function VideoPage({ videoId }: { videoId: string }) {
    const [data, setData] = useState<Data>();
    console.log(data);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_ROOT}/api/getVideo?videoId=${videoId}`
                );
                console.log({ res });
                const jsonRes = await res.json();
                console.log({ jsonRes });
                setData(jsonRes.data[0] as Data);
            } catch (error) {
                console.error("Failed to fetch video data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (videoId) {
            fetchData();
        }
    }, [videoId]);
    // const videoId = (await params).videoId;
    //
    if (loading) {
        return <VideoPageSkeleton number={10} />;
    }
    return (
        <div>
            <iframe
                width="100%"
                height="480px"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allowFullScreen
                className={styles.iframe}
            ></iframe>

            <div className={styles.videoDetails}>
                <h1 className={styles.title}>{data?.title}</h1>
                <h2 className={styles.channelTitle}>{data?.channelTitle}</h2>
                <div className={styles.meta}>
                    <span className={styles.views}>
                        {formatNumberWithCommas(data?.viewCount)} views
                    </span>
                    <span className={styles.date}>
                        {formatDate(data?.date)}
                    </span>
                </div>
                <pre className={styles.description}>{data?.description}</pre>
            </div>
        </div>
    );
}
