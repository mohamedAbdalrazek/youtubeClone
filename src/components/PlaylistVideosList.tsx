import { PlaylistDocument } from "@/utils/types";
import Image from "next/image";
import React from "react";
import styles from "@/css/PlaylistVideosList.module.css";
export default function PlaylistVideosList({
    currentIndex,
    setCurrentIndex,
    playlist,
}: {
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    playlist: PlaylistDocument;
}) {
    return (
        <div className={styles.listWrapper}>
            <div className={styles.listHeader}>
                <h3>{playlist.title} Playlist</h3>
                <p>- {playlist.userName}</p>
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
                            <div className={styles.imageWrapper}>

                                <Image
                                    src={video.url}
                                    alt={video.title}
                                    width={video.width}
                                    height={video.height}
                                    className={styles.thumbnail}
                                />
                            </div>
                            <div className={styles.info}>
                                <p className={styles.videoTitle}>{video.title}</p>
                                <p className={styles.channelTitle}>{video.channelTitle}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
