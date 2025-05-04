import PlaylistCard from "@/components/playlists-page/PlaylistCard";
import React from "react";
import styles from "./Playlists.module.css";
import { UserPlaylistMap } from "@/utils/types";
export default function Playlists({
    playlists,
}: {
    playlists: UserPlaylistMap[];
}) {
    return (
        <div className={styles.playlistsPage}>
            <h1 className={styles.header}>Playlists</h1>
            <div className={styles.playlistsWrapper}>
                {playlists.map((playlist: UserPlaylistMap) => (
                    <PlaylistCard key={playlist.playlistId} playlist={playlist} />
                ))}
            </div>
        </div>
    );
}
