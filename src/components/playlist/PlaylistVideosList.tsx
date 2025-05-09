import Image from "next/image";
import React, { MouseEvent, useState } from "react";
import styles from "./PlaylistVideosList.module.css";
import { PlaylistMap, UserFavoritePlaylistMap } from "@/utils/types";
// import AddToPlaylistButton from "../refactor/AddToPlaylistButton";
import SavePlaylist from "./SavePlaylist";
import EllipsisIcon from "@/icons/EllipsisIcon";
import AddBox from "../refactor/AddBox";
import DeleteYourPlaylist from "../refactor/DeleteYourPlaylist";
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
        count: playlist.videos.length,
        isYoutube,
    };
    const [openedBox, setOpenedBox] = useState<number | null>(null);
    const handleEllipiseClick = (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
        index: number
    ) => {
        e.stopPropagation();
        if (index === openedBox) {
            setOpenedBox(null);
        } else {
            setOpenedBox(index);
        }
    };
    return (
        <div className={styles.listWrapper}>
            <div className={styles.listHeader}>
                <div>
                    <h3>{playlist.title} Playlist</h3>
                    <p>- {playlist.creator}</p>
                </div>

                {true ? (
                    <DeleteYourPlaylist
                        playlistId={playlist.playlistId}
                        className={styles.deletePlaylist}
                    />
                ) : (
                    <SavePlaylist
                        playlist={newPlaylist}
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
                                    <button
                                        className={styles.ellipsisWrapper}
                                        onClick={(e) =>
                                            handleEllipiseClick(e, index)
                                        }
                                    >
                                        <EllipsisIcon
                                            className={styles.ellipsisIcon}
                                        />
                                    </button>
                                    {openedBox === index && (
                                        <AddBox
                                            data={video}
                                            playlistId={playlist.playlistId}
                                            isOwner={true}
                                        />
                                    )}
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
