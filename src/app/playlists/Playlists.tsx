import PlaylistCard from "@/components/playlists-page/PlaylistCard";
import React from "react";
import styles from "./Playlists.module.css";
import { UserFavoritePlaylistMap, UserPlaylistMap } from "@/utils/types";
export default function Playlists({
    playlists,
    header,
}: {
    playlists: UserPlaylistMap[] | UserFavoritePlaylistMap[];
    header: string;
}) {
    if(!playlists || playlists.length ===0)return
    return (
        <div className={styles.playlistsPage}>
            <h2 className={styles.header}>{header}</h2>
            <div className={styles.playlistsWrapper}>
                {playlists.map((playlist: UserPlaylistMap|UserFavoritePlaylistMap) => (
                    <PlaylistCard
                        key={playlist.playlistId}
                        playlist={playlist}
                    />
                ))}
            </div>
        </div>
    );
}
