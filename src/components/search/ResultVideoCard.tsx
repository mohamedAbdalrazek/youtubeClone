import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./ResultCard.module.css";
import { htmlDecode } from "@/utils/utils";
import { PlaylistVideoMap, VideoResultMap } from "@/utils/types";
import EllipsisIcon from "@/icons/EllipsisIcon";
import AddBox from "../refactor/AddBox";
import { useOpenedBox } from "@/context/OpenedBoxContext";
export default function ResultVideoCard({ video }: { video: VideoResultMap }) {
    const { openedBoxId, setOpenedBoxId } = useOpenedBox();
    const isOpen = openedBoxId === video.videoId;

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
                    <div className={styles.duration}>{video.duration}</div>
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
                <span className={styles.stats}>
                    <span>{video.numberOfViews}</span>
                    <span>|</span>
                    <span>{video.date}</span>
                </span>
            </div>
            <div onClick={(e)=>e.stopPropagation()}>
                <button
                    className={styles.ellipsisWrapper}
                    onClick={() =>
                        setOpenedBoxId(isOpen ? null : video.videoId)
                    }
                >
                    <EllipsisIcon
                        className={`${styles.ellipsisIcon} ${
                            isOpen && styles.ellipsisActive
                        }`}
                    />
                </button>
                {isOpen && (
                    <AddBox
                        className={styles.addBox}
                        data={video as PlaylistVideoMap}
                    />
                )}
            </div>
        </div>
    );
}
