import PlayIcon from "@/icons/PlayIcon";
import { PlaylistDocument } from "@/utils/types";
import Image from "next/image";
import React from "react";
import styles from "@/css/PlaylistCard.module.css";
import Link from "next/link";
import GlobeIcon from "@/icons/GlobeIcon";
import LockIcon from "@/icons/LockIcon";
import PlayListIcon from "@/icons/PlayListIcon";
export default function PlaylistCard({
    playlist,
}: {
    playlist: PlaylistDocument;
}) {
    const videosNumber = playlist.videos.length;
    const lastVideo = playlist.videos[videosNumber - 1];
    if (!lastVideo) return;
    return (
        <Link href={`/playlist/${playlist.id}`} className={styles.card}>
            {lastVideo && (
                <div className={styles.imageWrapper}>
                    <Image
                        src={lastVideo.url}
                        height={lastVideo.height}
                        width={lastVideo.width}
                        alt={playlist.title + "playlist"}
                        className={styles.image}
                    />
                    <div className={styles.videosNumber}>
                        <PlayListIcon className={styles.playlistIcon} />
                        <span>{videosNumber} Video{videosNumber>1 &&"s"}</span>
                    </div>
                    <div className={styles.playOverlay}>
                        <PlayIcon className={styles.playIcon} />
                        <span>Play {playlist.title}</span>
                    </div>
                    <div className={styles.iconWrapper}>
                        {playlist.isPublic ? (
                            <GlobeIcon className={styles.icon} />
                        ) : (
                            <LockIcon className={styles.icon} />
                        )}
                    </div>
                </div>
            )}
        </Link>
    );
}
