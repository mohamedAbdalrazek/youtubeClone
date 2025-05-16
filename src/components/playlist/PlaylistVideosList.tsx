import Image from "next/image";
import React, { MouseEvent, useState } from "react";
import styles from "./PlaylistVideosList.module.css";
import { PlaylistMap, UserFavoritePlaylistMap } from "@/utils/types";
// import AddToPlaylistButton from "../refactor/AddToPlaylistButton";
import SavePlaylist from "./SavePlaylist";
import EllipsisIcon from "@/icons/EllipsisIcon";
import AddBox from "../refactor/AddBox";
// import DeleteYourPlaylist from "../refactor/DeleteYourPlaylist";
import RemovePlaylist from "./RemovePlaylist";
import PlaylistOptionsBox from "../refactor/PlaylistOptionsBox";
import { useOpenedBox } from "@/context/OpenedBoxContext";
import GlobeIcon from "@/icons/GlobeIcon";
import LockIcon from "@/icons/LockIcon";
export default function PlaylistVideosList({
    currentIndex,
    setCurrentIndex,
    playlist,
    isYoutube,
}: {
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    playlist: PlaylistMap;
    isYoutube: boolean;
}) {
    const newPlaylist: UserFavoritePlaylistMap = {
        playlistId: playlist.playlistId,
        thumbnail: playlist.videos[0].thumbnail,
        title: playlist.title,
        videoCount: playlist.videos.length,
        isYoutube,
        isAvailable:true
    };
    const { openedBoxId, setOpenedBoxId } = useOpenedBox();

    const [isFavorite, setIsFavorite] = useState(false);

    const handleEllipiseClick = (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
        videoId: string
    ) => {
        e.stopPropagation();
        if (videoId === openedBoxId) {
            setOpenedBoxId(null);
        } else {
            setOpenedBoxId(videoId);
        }
    };
    return (
        <div className={styles.listWrapper}>
            <div className={styles.listHeader}>
                <div className={styles.headerLeftSide}>
                    <div className={styles.playlistTitleWrapper}>
                        {playlist.isPublic ? <GlobeIcon /> : <LockIcon />}
                        <h3>{playlist.title} Playlist</h3>
                    </div>
                    <p>- {playlist.creator}</p>
                </div>

                {playlist.isOwner ? (
                    <div
                        style={{ position: "relative" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                    >
                        <button
                            className={styles.ellipsisWrapper}
                            onClick={() =>
                                setOpenedBoxId(
                                    openedBoxId === playlist.playlistId
                                        ? null
                                        : playlist.playlistId
                                )
                            }
                        >
                            <EllipsisIcon
                                className={`${styles.ellipsisIcon} ${
                                    openedBoxId === playlist.playlistId &&
                                    styles.ellipsisActive
                                }`}
                            />
                        </button>
                        {openedBoxId === playlist.playlistId && (
                            <PlaylistOptionsBox
                                className={styles.optionsBox}
                                playlistId={playlist.playlistId}
                                visibility={
                                    playlist.isPublic ? "private" : "public"
                                }
                            />
                        )}
                    </div>
                ) : isFavorite ? (
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
                            <span className={styles.videoIndex}>
                                {index + 1}
                            </span>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={video.thumbnail}
                                    alt={video.title}
                                    width={480}
                                    height={360}
                                    className={styles.thumbnail}
                                />
                            </div>
                            <div className={styles.info}>
                                <div className={styles.titleWrapper}>
                                    <p className={styles.videoTitle}>
                                        {video.title}
                                    </p>
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                        }}
                                    >
                                        <button
                                            className={styles.ellipsisWrapper}
                                            onClick={(e) =>
                                                handleEllipiseClick(
                                                    e,
                                                    video.videoId
                                                )
                                            }
                                        >
                                            <EllipsisIcon
                                                className={`${
                                                    styles.ellipsisIcon
                                                } ${
                                                    openedBoxId ===
                                                        video.videoId &&
                                                    styles.ellipsisActive
                                                }`}
                                            />
                                        </button>
                                        {openedBoxId === video.videoId && (
                                            <AddBox
                                                data={video}
                                                playlistId={playlist.playlistId}
                                                isOwner={playlist.isOwner}
                                            />
                                        )}
                                    </div>
                                </div>
                                <p className={styles.channelTitle}>
                                    {video.channelTitle}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
