"use server";
import React from "react";
import styles from "./DiscoverPlaylists.module.css";
import PlaylistCard from "@/components/playlists-page/PlaylistCard";
import { PlaylistMap, UserFavoritePlaylistMap } from "@/utils/types";
const getPlaylists = async () => {
    try {
        const res = await fetch(`${process.env.ROOT}/api/getPublicPlaylists`, {
            cache: "no-store",
        });

        return res.json();
    } catch (err) {
        console.error("Failed to fetch playlists:", err);
        return { ok: false, message: "Failed to fetch playlists" };
    }
};

export default async function Page() {
    const { ok, playlists, message } = await getPlaylists();
    console.log(playlists);
    if (!ok) {
        return (
            <div>
                <p>{message || "Something went wrong."}</p>
            </div>
        );
    }

    if (!playlists || playlists.length === 0) {
        return (
            <div>
                <p>No playlists found.</p>
            </div>
        );
    }

    return (
        <div className={styles.playlistsPage}>
            <h2 className={styles.header}>Discover Playlists</h2>
            <div className={styles.playlistsWrapper}>
                {playlists.map((playlist: PlaylistMap) => {
                    const formedPlaylist: UserFavoritePlaylistMap = {
                        playlistId: playlist.playlistId,
                        title: playlist.title,
                        thumbnail: playlist.videos[0].thumbnail,
                        count: playlist.videos.length,
                        isYoutube: false,
                    };
                    return (
                        <PlaylistCard
                            key={playlist.playlistId}
                            playlist={formedPlaylist}
                        />
                    );
                })}
            </div>
        </div>
    );
}
