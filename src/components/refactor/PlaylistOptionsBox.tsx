import React, { RefObject } from "react";
import styles from "./AddBox.module.css";
import DeleteYourPlaylist from "./DeleteYourPlaylist";
import ChangePlaylistVisibility from "./ChangePlaylistVisibility";
export default function PlaylistOptionsBox({
    className,
    playlistId,
    ref,
    visibility
}: {
    className?: string;
    playlistId: string;
    ref?: RefObject<HTMLDivElement | null>;
    visibility:"public"|"private"
}) {
    return (
        <div
            className={`${styles.addBox} ${className} `}
            onClick={(e) => e.stopPropagation()}
            ref={ref}
        >
            <DeleteYourPlaylist
                className={styles.deleteButton}
                playlistId={playlistId}
            />
            <ChangePlaylistVisibility
                className={styles.changeButton}
                playlistId={playlistId}
                visibility={visibility}
            />
        </div>
    );
}
