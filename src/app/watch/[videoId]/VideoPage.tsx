"use client";
import React, { useEffect, useState } from "react";
export const dynamic = "force-dynamic";
import styles from "./VideoPage.module.css";
import { formatDate, formatNumberWithCommas } from "@/utils/utils";
import { WatchVideoMap } from "@/utils/types";
import AddToPlaylistButton from "@/components/refactor/AddToPlaylistButton";
import AddToWatchLater from "@/components/refactor/AddToWatchLater";
import Loading from "@/app/loading";
// import NotFound from "@/app/not-found";

export default function VideoPage({ videoId }: { videoId: string }) {
    const [data, setData] = useState<WatchVideoMap | null>(null);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState<{
    //     message: string;
    //     status: number;
    // } | null>(null);
    // useEffect(() => {
    //     if (!videoId) return;

    //     setLoading(true);

    //     fetch(`/api/getVideo?videoId=${videoId}`)
    //         .then((res) =>
    //             res.json().then((jsonRes) => {
    //                 if (!res.ok) {
    //                     return Promise.reject({
    //                         message:
    //                             jsonRes?.error ||
    //                             "Something went wrong while loading the video.",
    //                         status: res.status,
    //                     });
    //                 }
    //                 return jsonRes;
    //             })
    //         )
    //         .then((jsonRes) => {
    //             setData({ ...jsonRes.data, videoId });
    //         })
    //         .catch((error) => {
    //             setError({
    //                 message: error.message || "Something went wrong.",
    //                 status: error.status || 500,
    //             });
    //             console.error("Failed to fetch video data:", error);
    //         })
    //         .finally(() => {
    //             setLoading(false);
    //         });
    // }, [videoId]);
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
        return <Loading height="85vh" />;
    }
    // if (error) {
    //     return (
    //         <NotFound
    //             errorMessage={error.message}
    //             statusCode={error.status}
    //             target="back"
    //             buttonText="Go back"
    //         />
    //     );
    // }
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
