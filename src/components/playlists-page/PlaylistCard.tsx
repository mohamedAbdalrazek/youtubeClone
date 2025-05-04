import PlayIcon from "@/icons/PlayIcon";
import Image from "next/image";
import React from "react";
import styles from "./PlaylistCard.module.css";
import Link from "next/link";
import GlobeIcon from "@/icons/GlobeIcon";
import LockIcon from "@/icons/LockIcon";
import PlayListIcon from "@/icons/PlayListIcon";
import { UserPlaylistMap } from "@/utils/types";
export default function PlaylistCard({
    playlist,
}: {
    playlist: UserPlaylistMap;
}) {

    return (
        <Link href={`/playlist/${playlist.playlistId}`} className={styles.card}>
            {playlist.thumbnail && (
                <div className={styles.imageWrapper}>
                    <Image
                        src={playlist.thumbnail}
                        height={480}
                        width={360}
                        alt={playlist.title + "playlist"}
                        className={styles.image}
                    />
                    <div className={styles.videosNumber}>
                        <PlayListIcon className={styles.playlistIcon} />
                        <span>{playlist.count} Video{playlist.count>1 &&"s"}</span>
                    </div>
                    <div className={styles.playOverlay}>
                        <PlayIcon className={styles.playIcon} />
                        <span>Play {playlist.title}</span>
                    </div>
                    <div className={styles.iconWrapper}>
                        {playlist.visibility==="public" ? (
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
