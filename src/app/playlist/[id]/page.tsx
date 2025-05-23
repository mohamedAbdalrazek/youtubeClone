"use client";
import styles from "./PlaylistPage.module.css";
import React, { useEffect, useState } from "react";
import YouTubePlaylist from "@/components/playlist/PlaylistPlayer";
import { useParams, useSearchParams } from "next/navigation";
import { parseCookies } from "nookies";
import PlaylistVideosList from "@/components/playlist/PlaylistVideosList";
import PlaylistVideoMobility from "@/components/playlist/PlaylistVideoMobility";
import { FetchError, PlaylistMap } from "@/utils/types";
import { useOpenedBox } from "@/context/OpenedBoxContext";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";

export default function Page() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const playlistId = params.id;
    const isYoutube = useSearchParams().get("youtube");
    const [playlist, setPlaylist] = useState<PlaylistMap>();
    const { setOpenedBoxId } = useOpenedBox();
    const [error, setError] = useState<{
        message: string;
        status: number;
    } | null>(null);
    useEffect(() => {
        setLoading(true);
        const fetchUserData = async () => {
            try {
                const cookies = parseCookies();
                const authToken = cookies.token;
                const res = await fetch(
                    `/api/getOnePlaylist?playlistId=${playlistId}&youtube=${isYoutube}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
                const data = await res.json();
                if (!res.ok) {
                    throw {
                        message: data.message,
                        status: res.status,
                    };
                }
                setPlaylist(data.playlist);
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
        fetchUserData();
    }, [playlistId, isYoutube]);
    if (!playlistId) {
        return (
            <NotFound
                target="back"
                errorMessage={"Invalid playlist link"}
                statusCode={400}
                buttonText="Go back"
            />
        );
    }
    if (loading) {
        return <Loading height="85vh" />;
    }
    if (error) {
        return (
            <NotFound
                target="back"
                errorMessage={error.message}
                statusCode={error.status}
                buttonText="Go back"
            />
        );
    }
    if (!playlist) {
        return (
            <NotFound
                target="back"
                errorMessage={"Playlist isn't found"}
                statusCode={404}
                buttonText="Go back"
            />
        );
    }
    return (
        <div
            className={styles.playlistPage}
            onClick={() => setOpenedBoxId(null)}
        >
            <PlaylistVideoMobility
                setCurrentIndex={setCurrentIndex}
                currentIndex={currentIndex}
                videosLength={playlist.videos.length}
            />
            <div className={styles.playlistContainer}>
                <YouTubePlaylist
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    playlist={playlist}
                />
                <PlaylistVideosList
                    playlist={playlist}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    isYoutube={isYoutube === "true"}
                />
            </div>
        </div>
    );
}
