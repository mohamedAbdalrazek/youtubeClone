"use client";
import PlayIcon from "@/icons/PlayIcon";
import Image from "next/image";
import React from "react";
import styles from "./PlaylistCard.module.css";
import Link from "next/link";
import GlobeIcon from "@/icons/GlobeIcon";
import LockIcon from "@/icons/LockIcon";
import PlayListIcon from "@/icons/PlayListIcon";
import { UserFavoritePlaylistMap, UserPlaylistMap } from "@/utils/types";
import EllipsisIcon from "@/icons/EllipsisIcon";
import { useOpenedBox } from "@/context/OpenedBoxContext";
import PlaylistOptionsBox from "../refactor/PlaylistOptionsBox";
import RemovePlaylist from "../playlist/RemovePlaylist";
function isUserPlaylistMap(
    playlist: UserPlaylistMap | UserFavoritePlaylistMap
): playlist is UserPlaylistMap {
    return "visibility" in playlist;
}

function isUserFavoritePlaylistMap(
    playlist: UserPlaylistMap | UserFavoritePlaylistMap
): playlist is UserFavoritePlaylistMap {
    return "isYoutube" in playlist;
}

export default function PlaylistCard({
    playlist,
}: {
    playlist: UserPlaylistMap | UserFavoritePlaylistMap;
}) {
    const { openedBoxId, setOpenedBoxId } = useOpenedBox();
    const isOpen = openedBoxId === playlist.playlistId;
    const href =
        isUserFavoritePlaylistMap(playlist) && playlist.isYoutube
            ? `/playlist/${playlist.playlistId}?youtube=true`
            : `/playlist/${playlist.playlistId}`;

    return (
        <div style={{ position: "relative" }} className={styles.cardWrapper}>
            <Link href={href} className={styles.card}>
                {playlist.thumbnail && (
                    <div className={styles.imageWrapper}>
                        <Image
                            src={playlist.thumbnail}
                            height={270}
                            width={480}
                            alt={playlist.title + "playlist"}
                            className={styles.image}
                        />
                        <div className={styles.videosNumber}>
                            <PlayListIcon className={styles.playlistIcon} />
                            <span>
                                {playlist.videoCount} Video
                                {playlist.videoCount > 1 && "s"}
                            </span>
                        </div>
                        <div className={styles.playOverlay}>
                            <PlayIcon className={styles.playIcon} />
                            <span>
                                Play{" "}
                                {playlist.title
                                    .split(" ")
                                    .slice(0, 2)
                                    .join(" ")}
                                {playlist.title.split(" ").length > 2 && "..."}
                            </span>
                        </div>
                        {isUserPlaylistMap(playlist) && (
                            <div className={styles.iconWrapper}>
                                {playlist.visibility === "public" ? (
                                    <GlobeIcon className={styles.icon} />
                                ) : (
                                    <LockIcon className={styles.icon} />
                                )}
                            </div>
                        )}
                    </div>
                )}
            </Link>
            {isUserPlaylistMap(playlist) ? (
                <div
                    className={styles.optionsWrapper}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                >
                    <button
                        className={styles.ellipsisWrapper}
                        onClick={() =>
                            setOpenedBoxId(isOpen ? null : playlist.playlistId)
                        }
                    >
                        <EllipsisIcon
                            className={`${styles.ellipsisIcon} ${
                                isOpen && styles.ellipsisActive
                            }`}
                        />
                    </button>
                    {isOpen && (
                        <PlaylistOptionsBox
                            className={styles.deleteBox}
                            playlistId={playlist.playlistId}
                            visibility={
                                playlist.visibility === "public"
                                    ? "private"
                                    : "public"
                            }
                        />
                    )}
                </div>
            ) : (
                <RemovePlaylist
                    className={styles.removeFavoritePlaylist}
                    playlistId={playlist.playlistId}
                />
            )}
        </div>
    );
}
