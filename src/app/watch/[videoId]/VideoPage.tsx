"use client";
import React, { useEffect, useState } from "react";
export const dynamic = "force-dynamic";
import styles from "./VideoPage.module.css";
import { formatDate, formatNumberWithCommas } from "@/utils/utils";
import VideoPageSkeleton from "@/components/VideoPageSkeleton";
import { WatchVideoMap } from "@/utils/types";
import AddToPlaylistButton from "@/components/refactor/AddToPlaylistButton";

export default function VideoPage({ videoId }: { videoId: string }) {
    const [data, setData] = useState<WatchVideoMap | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_ROOT}/api/getVideo?videoId=${videoId}`
                );
                const jsonRes = await res.json();
                setData({ ...jsonRes.data, videoId });
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
    if (loading) {
        return <VideoPageSkeleton number={10} />;
    }
    if (!data) {
        return;
    }
    return (
        <div className={styles.videoPage}>
            <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allowFullScreen
                className={styles.videoFrame}
            ></iframe>
            <div className={styles.videoInfo}>
                <div className={styles.titleRow}>
                    <h1 className={styles.videoTitle}>{data?.title}</h1>
                    <AddToPlaylistButton
                        video={data}
                        className={styles.addButton}

                        isText={true}
                    />
                </div>

                <div className={styles.channelInfo}>
                    <span className={styles.channelName}>
                        {data?.channelTitle}
                    </span>
                </div>
                <div className={styles.videoStats}>
                    <span className={styles.views}>
                        {formatNumberWithCommas(data?.viewCount)} views
                    </span>
                    <span className={styles.uploadDate}>
                        {formatDate(data?.date)}
                    </span>
                </div>

                <div className={styles.videoDescription}>
                    <pre>{data?.description}</pre>
                </div>
            </div>
        </div>
    );
}
