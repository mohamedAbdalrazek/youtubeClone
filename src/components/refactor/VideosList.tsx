"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { MouseEvent, Suspense, useEffect, useState } from "react";
import styles from "./VideosList.module.css";
import { formatRelativeDate } from "@/utils/utils";
import VideoListSkeleton from "../VideoListSkeleton";
import AddPlaylistIcon from "@/icons/AddPlaylistIcon";
import AddPlaylistPopup from "../AddPlaylistPopup";
import { Video } from "@/utils/types";

const Search = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("search");
    const [data, setData] = useState<Video[]>();
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<null | Video>(null);
    useEffect(() => {
        if (!query) {
            return;
        }
        setLoading(true);
        fetch(`/api/searchVideos?query=${query}`)
            .then((res) => res.json())
            .then((data) => {
                setData(data.formedData);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [query]);
    const handleAddVideo = (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
        video: Video
    ) => {
        e.stopPropagation();
        e.preventDefault();
        setShowPopup(true);
        setSelectedVideo(video);
    };
    if (loading) {
        return <VideoListSkeleton number={10} />;
    }
    return (
        <div className={styles.resultsContainer}>
            {showPopup && (
                <AddPlaylistPopup
                    video={selectedVideo}
                    setShowPopup={setShowPopup}
                />
            )}

            <div className={styles.resultsGrid}>
                {data?.map((item) => {
                    console.log(item);
                    return (
                        item.videoId && (
                            <div
                                key={item.videoId}
                                className={styles.videoCard}
                            >
                                <Link
                                    href={`/watch/${
                                        item.videoId
                                    }?title=${item.title.split(" ").join("+")}`}
                                    className={styles.videoLink}
                                >
                                    <div className={styles.thumbnailWrapper}>
                                        <Image
                                            src={item.url}
                                            width={item.width}
                                            height={item.height}
                                            alt={item.title}
                                            className={styles.thumbnail}
                                        />
                                        <div className={styles.overlay}></div>
                                    </div>
                                </Link>

                                <div className={styles.videoInfo}>
                                    <Link
                                        href={`/watch/${
                                            item.videoId
                                        }?title=${item.title
                                            .split(" ")
                                            .join("+")}`}
                                        className={styles.videoLink}
                                    >
                                        <h3 className={styles.title}>
                                            {item.title}
                                        </h3>
                                    </Link>
                                    <span className={styles.channel}>
                                        {item.channelTitle}
                                    </span>
                                    <span className={styles.date}>
                                        {formatRelativeDate(item.date)}
                                    </span>
                                </div>

                                <button
                                    className={styles.addButton}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleAddVideo(e, item);
                                    }}
                                    aria-label="Add to playlist"
                                >
                                    <AddPlaylistIcon
                                        className={styles.addIcon}
                                    />
                                </button>
                            </div>
                        )
                    );
                })}
            </div>
        </div>
    );
};
export default function VideosList() {
    return (
        <Suspense fallback={<VideoListSkeleton number={10} />}>
            <Search />
        </Suspense>
    );
}
