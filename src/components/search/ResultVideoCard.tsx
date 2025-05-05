import Image from "next/image";
import Link from "next/link";
import React, { MouseEvent } from "react";
import styles from "./ResultCard.module.css";
import { htmlDecode } from "@/utils/utils";
import AddPlaylistIcon from "@/icons/AddPlaylistIcon";
import { VideoResultMap } from "@/utils/types";
export default function ResultVideoCard({
    video,
    handleAddVideo,
}: {
    video: VideoResultMap;
    handleAddVideo: (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
        video: VideoResultMap
    ) => void;
}) {
    if (!video.thumbnail) return;
    return (
        <div key={video.videoId} className={styles.videoCard}>
            <Link
                href={`/watch/${video.videoId}?title=${video.title
                    .split(" ")
                    .join("+")}`}
                className={styles.videoLink}
            >
                <div className={styles.thumbnailWrapper}>
                    <Image
                        src={video.thumbnail}
                        width={480}
                        height={360}
                        alt={video.title}
                        className={styles.thumbnail}
                    />
                </div>
            </Link>

            <div className={styles.videoInfo}>
                <Link
                    href={`/watch/${video.videoId}?title=${video.title
                        .split(" ")
                        .join("+")}`}
                    className={styles.videoLink}
                >
                    <h3 className={styles.title}>{htmlDecode(video.title)}</h3>
                </Link>
                <span className={styles.channel}>{video.channelTitle}</span>
                <span>{video.type}</span>
                <span className={styles.date}>
                    {video.date}
                </span>
            </div>

            <button
                className={styles.addButton}
                onClick={(e) => {
                    e.preventDefault();
                    handleAddVideo(e, video);
                }}
                aria-label="Add to playlist"
            >
                <AddPlaylistIcon className={styles.addIcon} />
            </button>
        </div>
    );
}
