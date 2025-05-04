import Image from "next/image";
import Link from "next/link";
import React, { MouseEvent } from "react";
import styles from "./ResultCard.module.css";
import { formatRelativeDate, htmlDecode } from "@/utils/utils";
import AddPlaylistIcon from "@/icons/AddPlaylistIcon";
import { SearchResultMap } from "@/utils/types";
export default function ResultVideoCard({
    item,
    handleAddVideo,
}: {
    item: SearchResultMap;
    handleAddVideo: (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
        video: SearchResultMap
    ) => void;
}) {
    return (
        <div key={item.videoId} className={styles.videoCard}>
            <Link
                href={`/watch/${item.videoId}?title=${item.title.split(" ").join("+")}`}
                className={styles.videoLink}
            >
                <div className={styles.thumbnailWrapper}>
                    <Image
                        src={item.thumbnail}
                        width={480}
                        height={360}
                        alt={item.title}
                        className={styles.thumbnail}
                    />
                </div>
            </Link>

            <div className={styles.videoInfo}>
                <Link
                    href={`/watch/${item.videoId}?title=${item.title
                        .split(" ")
                        .join("+")}`}
                    className={styles.videoLink}
                >
                    <h3 className={styles.title}>{htmlDecode(item.title)}</h3>
                </Link>
                <span className={styles.channel}>{item.channelTitle}</span>
                <span>{item.type}</span>
                <span className={styles.date}>
                    {formatRelativeDate(item.date)}
                </span>
            </div>

            <button
                className={styles.addButton}
                onClick={(e) => {
                    e.preventDefault();
                    handleAddVideo(e, item);
                }}
                aria-label="Add to playlist"
            >
                <AddPlaylistIcon className={styles.addIcon} />
            </button>
        </div>
    );
}
