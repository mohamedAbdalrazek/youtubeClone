import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./ResultCard.module.css";
import { htmlDecode } from "@/utils/utils";
import { VideoResultMap } from "@/utils/types";
import AddToPlaylistButton from "../refactor/AddToPlaylistButton";
export default function ResultVideoCard({
    video
}: {
    video: VideoResultMap;
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
                    <div className={styles.duration}>
                        {video.duration}
                    </div>
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
                <span className={styles.stats}>
                    <span>{video.numberOfViews}</span>
                    <span>|</span>
                    <span>{video.date}</span>
                </span>
            </div>
            <AddToPlaylistButton video={video} className={styles.addButton} />
            {/* <button
                className={styles.addButton}
                onClick={(e) => {
                    e.preventDefault();
                    handleAddVideo(e, video);
                }}
                aria-label="Add to playlist"
            >
                <AddPlaylistIcon className={styles.addIcon} />
            </button> */}
        </div>
    );
}
