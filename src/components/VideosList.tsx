"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { MouseEvent, Suspense, useEffect, useState } from "react";
import styles from "@/css/VideoList.module.css";
import { formatRelativeDate } from "@/utils/utils";
import VideoListSkeleton from "./VideoListSkeleton";
import AddPlaylistIcon from "@/icons/AddPlaylistIcon";
import AddPlaylistPopup from "./AddPlaylistPopup";
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
    const handleAddVideo = (e: MouseEvent<HTMLDivElement>, video: Video) => {
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

            {data?.map((item) => {
                return (
                    item.videoId && (
                        <Link
                            key={item.videoId}
                            href={`/watch/${item.videoId}?title=${item.title
                                .split(" ")
                                .join("+")}`}
                            className={styles.resultsLink}
                        >
                            <div className={styles.resultItemContainer}>
                                <div className={styles.resultItem}>
                                    <div className={styles.thumbnail}>
                                        <Image
                                            src={item.url}
                                            width={item.width}
                                            height={item.height}
                                            alt={item.title}
                                            className={styles.image}
                                        />
                                    </div>
                                    <div className={styles.details}>
                                        <h3 className={styles.title}>
                                            {item.title}
                                        </h3>
                                        <span className={styles.date}>
                                            {formatRelativeDate(item.date)}
                                        </span>
                                        <span className={styles.channelTitle}>
                                            {item.channelTitle}
                                        </span>
                                    </div>
                                </div>
                                <div onClick={(e) => handleAddVideo(e, item)}>
                                    <AddPlaylistIcon
                                        className={styles.addPlaylist}
                                    />
                                </div>
                            </div>
                        </Link>
                    )
                );
            })}
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
