"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import styles from "./VideosList.module.css";
import { PlaylistResultMap, VideoResultMap } from "@/utils/types";
import ResultVideoCard from "@/components/search/ResultVideoCard";
import { ResultPlaylistCard } from "@/components/search/ResultPlaylistCard";
import Loading from "../loading";
import NotFound from "../not-found";

const Search = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("search");
    const type = searchParams.get("type");
    const [videos, setVideos] = useState<VideoResultMap[]>();
    const [playlists, setPlaylists] = useState<PlaylistResultMap[]>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{
        message: string;
        status: number;
    } | null>(null);

    useEffect(() => {
        if (!query) return;

        setLoading(true);
        setError(null); // Reset error

        fetch(`/api/search?query=${encodeURIComponent(query)}&type=${type}`)
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                    return Promise.reject({
                        message: data?.error || "An unexpected error occurred.",
                        status: res.status,
                    });
                }

                if (type === "playlist") {
                    setPlaylists(data.playlists);
                } else {
                    setVideos(data.videosList);
                }
            })
            .catch((err) => {
                setError({
                    message: err.message || "Something went wrong.",
                    status: err.status || 500,
                });
                console.error("Search fetch error:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [query, type]);
    if (loading) {
        return <Loading height="65vh" />;
    }
    if (error) {
        return (
            <NotFound
                errorMessage={error.message}
                statusCode={error.status}
                isButton={false}
            />
        );
    }
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
        <Suspense fallback={<Loading height="65vh"/>}>
            <Search />
        </Suspense>
    );
}
