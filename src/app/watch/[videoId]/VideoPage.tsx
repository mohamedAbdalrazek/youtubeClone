"use client";
import React, { useEffect, useState } from "react";
export const dynamic = "force-dynamic";
import styles from "./VideoPage.module.css";
import { formatDate, formatNumberWithCommas } from "@/utils/utils";
import { FetchError, WatchVideoMap } from "@/utils/types";
import AddToPlaylistButton from "@/components/refactor/AddToPlaylistButton";
import AddToWatchLater from "@/components/refactor/AddToWatchLater";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";

export default function VideoPage({ videoId }: { videoId: string }) {
    const [data, setData] = useState<WatchVideoMap | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<{
        message: string;
        status: number;
    } | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/getVideo?videoId=${videoId}`);
                const jsonRes = await res.json();
                if (!res.ok) {
                    throw {
                        message:
                            jsonRes?.error ||
                            "Something went wrong while loading the video.",
                        status: res.status,
                    };
                }
                setData({ ...jsonRes.data, videoId });
            } catch (error) {
                const err = error as FetchError;
                setError({
                    message: err.message || "Something went wrong.",
                    status: err.status || 500,
                });
            } finally {
                setLoading(false);
            }
        };

        if (videoId) {
            fetchData();
        }
    }, [videoId]);
    if (loading) {
        return <Loading height="85vh" />;
    }
    if (error) {
        return (
            <NotFound
                errorMessage={error.message}
                statusCode={error.status}
                target="back"
                buttonText="Go back"
            />
        );
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
                <h1 className={styles.videoTitle}>{data?.title}</h1>

                <div className={styles.channelInfo}>
                    <span className={styles.channelName}>
                        {data?.channelTitle}
                    </span>
                    <div className={styles.addRow}>
                        <AddToWatchLater
                            isText={true}
                            className={styles.watchLaterButton}
                            video={data}
                        />
                        <span>|</span>
                        <AddToPlaylistButton
                            video={data}
                            className={styles.addButton}
                            isText={true}
                        />
                    </div>
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
