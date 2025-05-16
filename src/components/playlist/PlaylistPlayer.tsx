// components/YouTubePlaylist.tsx

// import { formatDate } from "@/utils/utils";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./PlaylistPlayer.module.css";
import { PlaylistMap } from "@/utils/types";
import AddToPlaylistButton from "../refactor/AddToPlaylistButton";
import AddToWatchLater from "../refactor/AddToWatchLater";
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
            if (
                event.data === window.YT?.PlayerState?.ENDED &&
                currentIndex < playlist.videos.length - 1
            ) {
                setCurrentIndex((prev) => {
                    const nextIndex = prev + 1;
                    return nextIndex < playlist.videos.length
                        ? nextIndex
                        : prev;
                });
            }
        },
        [currentIndex, setCurrentIndex, playlist.videos.length]
    );

    useEffect(() => {
        if (!window.YT) {
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
        const video = playlist?.videos?.[currentIndex];
        if (!isApiReady || !video?.videoId) {
            return;
        }

        if (!playerRef.current) {
            try {
                playerRef.current = new window.YT.Player("player", {
                    videoId: video.videoId,
                    events: { onStateChange: onPlayerStateChange },
                });
            } catch (error) {
                console.error("Error creating YouTube Player:", error);
            }
        } else if (typeof playerRef.current.loadVideoById === "function") {
            try {
                playerRef.current.loadVideoById(video.videoId);
            } catch (error) {
                console.error("Error loading video:", error);
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
                <div className={styles.addRow}>
                    <AddToWatchLater
                        isText={true}
                        className={styles.watchLaterButton}
                        video={playlist.videos[currentIndex]}
                    />
                    <span>|</span>
                    <AddToPlaylistButton
                        video={playlist.videos[currentIndex]}
                        className={styles.addButton}
                        isText={true}
                    />
                </div>
            </div>
        </div>
    );
}
