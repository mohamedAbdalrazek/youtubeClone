import styles from "./ResultCard.module.css";
import Link from "next/link";
import Image from "next/image";
import PlayListIcon from "@/icons/PlayListIcon";
import { formatRelativeDate, htmlDecode } from "@/utils/utils";
import { SearchResultMap } from "@/utils/types";

export const ResultPlaylistCard = ({ item }: { item: SearchResultMap }) => {
    const url = item.type === "playlist" ? item.playlistId : item.videoId;

    return (
        (item.videoId || item.playlistId) && (
            <div
                key={url}
                className={`${styles.videoCard} ${styles.playlistCard}`}
            >
                <Link
                    href={`/playlist/${url}?youtube=true`}
                    className={styles.videoLink}
                >
                    <div className={styles.thumbnailWrapper}>
                        <div className={styles.hoverWrapper}>
                            <Image
                                src={item.thumbnail}
                                width={480}
                                height={360}
                                alt={item.title}
                                className={styles.thumbnail}
                            />
                        </div>
                        <span className={styles.playlistBadge}>
                            <PlayListIcon className={styles.playlistIcon} />
                            <span>Playlist</span>
                        </span>
                    </div>
                </Link>

                <div className={styles.videoInfo}>
                    <Link
                        href={`/playlist/${url}?youtube=true`}
                        className={styles.videoLink}
                    >
                        <h3 className={styles.title}>{htmlDecode(item.title)}</h3>
                    </Link>
                    <span className={styles.channel}>{item.channelTitle}</span>
                    <span className={styles.date}>
                        {formatRelativeDate(item.date)}
                    </span>
                </div>
            </div>
        )
    );
};
