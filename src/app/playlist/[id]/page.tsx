"use client";
import React, { useEffect, useState } from "react";
import YouTubePlaylist from "@/components/playlist/PlaylistPlayer";
import { useParams, useSearchParams } from "next/navigation";
import { parseCookies } from "nookies";
import PlaylistVideosList from "@/components/playlist/PlaylistVideosList";
import PlaylistVideoMobility from "@/components/playlist/PlaylistVideoMobility";
import { PlaylistMap } from "@/utils/types";

export default function Page() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const playlistId = params.id;
    const isYoutube = useSearchParams().get("youtube");
    const [playlist, setPlaylist] = useState<PlaylistMap>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
                    setErrorMessage(
                        data.message || "Failed to fetch play  ls."
                    );
                    console.error(data.message || "Failed to fetch play  ls.");
                    return;
                }
                setPlaylist(data.playlist);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
                setErrorMessage("An error occurred.");
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [playlistId, isYoutube]);
    if (!playlistId) {
        return <div>Invalid playlist link.</div>;
    }
    if (loading) {
        return <div>loading</div>;
    }
    if (errorMessage || !playlist) {
        return <div>{errorMessage}</div>;
    }
    return (
        <div
            style={{
                padding: "20px",
            }}
        >
            <PlaylistVideoMobility
                setCurrentIndex={setCurrentIndex}
                currentIndex={currentIndex}
                videosLength={playlist.videos.length}
            />
            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    justifyContent: "center",
                }}
            >
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
