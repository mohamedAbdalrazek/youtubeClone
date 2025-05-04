// components/YouTubePlaylist.tsx

import { formatDate } from "@/utils/utils";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./PlaylistPlayer.module.css";
import { PlaylistMap } from "@/utils/types";
// Light type definitions for YouTube IFrame Player
type YTPlayer = {
    loadVideoById: (videoId: string) => void;
};

type YTPlayerStateChangeEvent = {
    data: number;
};

declare global {
    interface Window {
        YT: {
            Player: new (
                elementId: string,
                options: {
                    videoId: string;
                    events: {
                        onStateChange: (
                            event: YTPlayerStateChangeEvent
                        ) => void;
                    };
                }
            ) => YTPlayer;
            PlayerState: {
                ENDED: number;
                [key: string]: number;
            };
        };
        onYouTubeIframeAPIReady: () => void;
    }
}

export default function YouTubePlaylist({
    currentIndex,
    setCurrentIndex,
    playlist,
}: {
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    playlist: PlaylistMap;
}) {
    const playerRef = useRef<YTPlayer | null>(null);
    const [isApiReady, setIsApiReady] = useState(false);

    const onPlayerStateChange = useCallback(
        (event: YTPlayerStateChangeEvent) => {
            if (event.data === window.YT?.PlayerState?.ENDED) {
                if (currentIndex < playlist.videos.length - 1) {
                    setCurrentIndex((prev) => prev + 1);
                }
            }
        },
        [currentIndex, setCurrentIndex, playlist.videos.length]
    );

    useEffect(() => {
        if (!window.YT) {
            console.log("YouTube API not found, loading...");
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);

            window.onYouTubeIframeAPIReady = () => {
                console.log("YouTube API Ready callback triggered.");
                setIsApiReady(true);
            };
        } else {
            console.log("YouTube API already present.");
            setIsApiReady(true);
        }

        return () => {
            window.onYouTubeIframeAPIReady = () => {};
        };
    }, []);

    useEffect(() => {
        console.log(
            "Second useEffect triggered. isApiReady:",
            isApiReady,
            "playerRef.current:",
            playerRef.current,
            "videoId:",
            playlist?.videos?.[currentIndex]?.videoId
        );
        if (
            isApiReady &&
            playlist?.videos?.[currentIndex]?.videoId &&
            !playerRef.current
        ) {
            console.log("Attempting to create new YouTube Player...");
            try {
                playerRef.current = new window.YT.Player("player", {
                    videoId: playlist.videos[currentIndex].videoId,
                    events: {
                        onStateChange: onPlayerStateChange,
                    },
                });
            } catch (error) {
                console.error("Error creating YouTube Player:", error);
            }
        } else if (
            isApiReady &&
            playerRef.current &&
            playlist?.videos?.[currentIndex]?.videoId
        ) {
            // Add a check to ensure loadVideoById exists
            if (typeof playerRef.current.loadVideoById === "function") {
                try {
                    playerRef.current.loadVideoById(
                        playlist.videos[currentIndex].videoId
                    );
                } catch (error) {
                    console.error("Error loading video:", error);
                }
            } else {
                console.warn(
                    "playerRef.current.loadVideoById is not a function yet."
                );
            }
        }
    }, [isApiReady, currentIndex, onPlayerStateChange, playlist.videos]);

    return (
        <div className={styles.videoWrapper}>
            <div id="player" className={styles.video} />
            <h3 className={styles.videoTitle}>
                {playlist.videos[currentIndex].title}
            </h3>
            <div className={styles.info}>
                <p className={styles.channelTitle}>
                    {playlist.videos[currentIndex].channelTitle}
                </p>
                <span className={styles.date}>
                    {formatDate(playlist.videos[currentIndex].date)}
                </span>
            </div>
        </div>
    );
}
