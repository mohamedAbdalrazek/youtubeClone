"use client";
import { useSearchParams } from "next/navigation";
import React, { MouseEvent, Suspense, useEffect, useState } from "react";
import styles from "./VideosList.module.css";
import VideoListSkeleton from "../../components/VideoListSkeleton";
import AddPlaylistPopup from "../../components/AddPlaylistPopup";
import { PlaylistVideoMap, SearchResultMap } from "@/utils/types";
import ResultVideoCard from "@/components/search/ResultVideoCard";
import { ResultPlaylistCard } from "@/components/search/ResultPlaylistCard";

const Search = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("search");
    const [data, setData] = useState<SearchResultMap[]>();
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<null | PlaylistVideoMap>(
        null
    );
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
        video: SearchResultMap
    ) => {
        e.stopPropagation();
        e.preventDefault();
        if(!video.videoId){
            return
        }
        setShowPopup(true);
        const formedData = {
            videoId:video.videoId,
            thumbnail: video.thumbnail,
            channelTitle: video.channelTitle,
            title: video.title,
            date: video.date,
        };
        setSelectedVideo(formedData);
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
                    if (!item.videoId && !item.playlistId) return;
                    return item.type === "video" ? (
                        <ResultVideoCard
                            key={item.videoId}
                            item={item}
                            handleAddVideo={handleAddVideo}
                        />
                    ) : (
                        <ResultPlaylistCard key={item.playlistId} item={item} />
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
