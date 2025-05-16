"use client"
import styles from "./ResultCard.module.css";
import Link from "next/link";
import Image from "next/image";
import PlayListIcon from "@/icons/PlayListIcon";
import { htmlDecode } from "@/utils/utils";
import { PlaylistResultMap, UserFavoritePlaylistMap } from "@/utils/types";
import SavePlaylist from "../playlist/SavePlaylist";
import { useState } from "react";
import RemovePlaylist from "../playlist/RemovePlaylist";

export const ResultPlaylistCard = ({
    playlist,
    isYoutube = true,
}: {
    playlist: PlaylistResultMap;
    isYoutube?: boolean;
}) => {
    const newPlaylist: UserFavoritePlaylistMap = {
        playlistId: playlist.playlistId,
        title: playlist.title,
        thumbnail: playlist.thumbnail,
        videoCount: playlist.videoCount,
        isYoutube,
        isAvailable: true,
    };
    const [isFavorite, setIsFavorite] = useState(false);
    const href= `/playlist/${playlist.playlistId}?${
                    isYoutube ? "youtube=true":""
                }`
    return (
        <div
            key={playlist.playlistId}
            className={`${styles.videoCard} ${styles.playlistCard}`}
        >
            <Link
                href={href}
                className={styles.videoLink}
            >
                <div className={styles.thumbnailWrapper}>
                    <div className={styles.hoverWrapper}>
                        <Image
                            src={playlist.thumbnail}
                            width={480}
                            height={360}
                            alt={playlist.title}
                            className={styles.thumbnail}
                        />
                    </div>
                    <span className={styles.playlistBadge}>
                        <PlayListIcon className={styles.playlistIcon} />
                        <span>{playlist.videoCount} videos</span>
                    </span>
                </div>
            </Link>
            <div className={styles.videoInfo}>
                <Link
                    href={href}
                    className={styles.videoLink}
                >
                    <h3 className={styles.title}>
                        {htmlDecode(playlist.title)}
                    </h3>
                </Link>
                <span className={styles.channel}>{playlist.channelTitle}</span>
            </div>
            {isFavorite ? (
                <RemovePlaylist
                    playlistId={playlist.playlistId}
                    setIsFavorite={setIsFavorite}
                    className={styles.deletePlaylist}
                />
            ) : (
                <SavePlaylist
                    playlist={newPlaylist}
                    setIsFavorite={setIsFavorite}
                    className={styles.savePlaylistButton}
                />
            )}
        </div>
    );
};
