import Image from "next/image";
import React from "react";
import styles from "./PlaylistVideosList.module.css";
import { PlaylistMap } from "@/utils/types";
import AddToPlaylistButton from "../refactor/AddToPlaylistButton";
export default function PlaylistVideosList({
    currentIndex,
    setCurrentIndex,
    playlist,
}: {
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    playlist: PlaylistMap;
}) {
    return (
        <div className={styles.listWrapper}>
            <div className={styles.listHeader}>
                <h3>{playlist.title} Playlist</h3>
                <p>- {playlist.creator}</p>
            </div>
            <div className={styles.list}>
                {playlist.videos.map((video, index) => {
                    return (
                        <div
                            className={`${
                                currentIndex === index && styles.activeVideo
                            } ${styles.videoWrapper}`}
                            onClick={() => setCurrentIndex(index)}
                            key={video.videoId}
                        >
                            <span className={styles.videoIndex}>
                                {index+1}
                            </span>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={video.thumbnail}
                                    alt={video.title}
                                    width={480}
                                    height={360}
                                    className={styles.thumbnail}
                                />
                            </div>
                            <div className={styles.info}>
                                <div className={styles.titleWrapper}>
                                    <p className={styles.videoTitle}>
                                        {video.title}
                                    </p>
                                    <AddToPlaylistButton
                                        video={video}
                                        className={styles.addButton}
                                    />
                                </div>
                                <p className={styles.channelTitle}>
                                    {video.channelTitle}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
