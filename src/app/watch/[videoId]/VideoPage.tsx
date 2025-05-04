"use client";
import React, { MouseEvent, useEffect, useState } from "react";
export const dynamic = "force-dynamic";
import styles from "./VideoPage.module.css";
import { formatDate, formatNumberWithCommas } from "@/utils/utils";
import VideoPageSkeleton from "@/components/VideoPageSkeleton";
import AddPlaylistIcon from "@/icons/AddPlaylistIcon";
import AddPlaylistPopup from "../../../components/AddPlaylistPopup";
import { PlaylistVideoMap, WatchVideoMap } from "@/utils/types";


export default function VideoPage({ videoId }: { videoId: string }) {
    const [data, setData] = useState<WatchVideoMap | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_ROOT}/api/getVideo?videoId=${videoId}`
                );
                const jsonRes = await res.json();
                setData({ ...jsonRes.data[0], videoId });
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
    const handleAddVideo = (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
        e.stopPropagation();
        e.preventDefault();
        setShowPopup(true);
    };
    if (loading) {
        return <VideoPageSkeleton number={10} />;
    }
    if (!data) {
        return;
    }
    const formedVideo: PlaylistVideoMap = {
        videoId,
        thumbnail: data.thumbnail,
        channelTitle: data.channelTitle,
        title: data.title,
        date: data.date,
    };
    return (
        <div className={styles.videoPage}>
            {showPopup && (
                <AddPlaylistPopup
                    video={formedVideo}
                    setShowPopup={setShowPopup}
                />
            )}
            <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allowFullScreen
                className={styles.videoFrame}
            ></iframe>
            <div className={styles.videoInfo}>
                <div className={styles.titleRow}>
                    <h1 className={styles.videoTitle}>{data?.title}</h1>
                    <button
                        className={styles.addButton}
                        onClick={(e) => {
                            e.preventDefault();
                            handleAddVideo(e);
                        }}
                        aria-label="Add to playlist"
                    >
                        <span>Add to Playlist</span>
                        <AddPlaylistIcon className={styles.addIcon} />
                    </button>
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
