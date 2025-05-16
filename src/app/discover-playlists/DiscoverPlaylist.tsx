"use client"
import React from "react";
import styles from "./DiscoverPlaylists.module.css";
import { PlaylistMap, PlaylistResultMap } from "@/utils/types";
import { ResultPlaylistCard } from "@/components/search/ResultPlaylistCard";
export default function DiscoverPlaylist({
    playlists,
}: {
    playlists: PlaylistMap[];
}) {
    return (
        <div className={styles.playlistsPage}>
            <h2 className={styles.header}>Discover Playlists</h2>
            <div className={styles.resultsGrid}>
                {playlists.map((playlist: PlaylistMap) => {
                    const formedPlaylist: PlaylistResultMap = {
                        playlistId: playlist.playlistId,
                        title: playlist.title,
                        thumbnail: playlist.videos[0].thumbnail,
                        videoCount: playlist.videos.length,
                        channelTitle: playlist.creator,
                    };
                    return (
                        <ResultPlaylistCard
                            key={playlist.playlistId}
                            playlist={formedPlaylist}
                            isYoutube={false}
                        />
                    );
                })}
            </div>
        </div>
    );
}
