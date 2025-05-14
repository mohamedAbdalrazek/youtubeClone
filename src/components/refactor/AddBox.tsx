import React, { RefObject } from "react";
import styles from "./AddBox.module.css";
import AddToWatchLater from "./AddToWatchLater";
import AddToPlaylistButton from "./AddToPlaylistButton";
import { PlaylistVideoMap } from "@/utils/types";
import DeleteFromPlaylist from "./DeleteFromPlaylist";
export default function AddBox({
    className,
    data,
    isOwner = false,
    playlistId,
    ref
}: {
    className?: string;
    data: PlaylistVideoMap;
    isOwner?: boolean;
    playlistId?: string;
    ref?:RefObject<HTMLDivElement | null>
}) {
    return (
        <div
            className={`${styles.addBox} ${className} `}
            onClick={(e) => e.stopPropagation()}
            ref={ref}
        >
            <AddToWatchLater
                isText={true}
                className={styles.watchLaterButton}
                video={data}
            />
            <AddToPlaylistButton
                video={data}
                className={styles.addButton}
                isText={true}
            />
            {isOwner && playlistId && (
                <DeleteFromPlaylist
                    isText={true}
                    videoId={data.videoId}
                    playlistId={playlistId}
                    className={styles.deleteButton}
                />
            )}
        </div>
    );
}
