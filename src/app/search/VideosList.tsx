"use client";
import { useSearchParams } from "next/navigation";
import React, {  Suspense, useEffect, useState } from "react";
import styles from "./VideosList.module.css";
import VideoListSkeleton from "../../components/VideoListSkeleton";
import {
    PlaylistResultMap,
    VideoResultMap,
} from "@/utils/types";
import ResultVideoCard from "@/components/search/ResultVideoCard";
import { ResultPlaylistCard } from "@/components/search/ResultPlaylistCard";

const Search = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("search");
    const type = searchParams.get("type");
    const [videos, setVideos] = useState<VideoResultMap[]>();
    const [playlists, setPlaylists] = useState<PlaylistResultMap[]>();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!query) {
            return;
        }
        setLoading(true);
        fetch(`/api/search?query=${query}&type=${type}`)
            .then((res) => res.json())
            .then((data) => {
                if (type === "playlist") {
                    console.log({ data });
                    setPlaylists(data.playlists);
                } else {
                    setVideos(data.videosList);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [query, type]);
    if (loading) {
        return <VideoListSkeleton number={10} />;
    }
    console.log(playlists);
    const SearchResultList = () => {
        if (type === "playlist") {
            return (
                <>
                    {playlists?.map((playlist) => {
                        if (!playlist.playlistId) return null;
                        return (
                            <ResultPlaylistCard
                                key={playlist.playlistId}
                                playlist={playlist}
                            />
                        );
                    })}
                </>
            );
        } else {
            return (
                <>
                    {videos?.map((video) => {
                        if (!video.videoId) return null;
                        return (
                            <ResultVideoCard
                                key={video.videoId}
                                video={video}
                            />
                        );
                    })}
                </>
            );
        }
    };

    return (
        <div className={styles.resultsContainer}>
            <div className={styles.resultsGrid}>
                <SearchResultList />
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
