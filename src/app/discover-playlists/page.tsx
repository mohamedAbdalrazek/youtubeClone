import React from "react";
import DiscoverPlaylist from "./DiscoverPlaylist";
const getPlaylists = async () => {
    try {
        const res = await fetch(`${process.env.ROOT}/api/getPublicPlaylists`);

        return res.json();
    } catch (err) {
        console.error("Failed to fetch playlists:", err);
        return { ok: false, message: "Failed to fetch playlists" };
    }
};

export default async function Page() {
    const { ok, playlists, message } = await getPlaylists();
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

    return <DiscoverPlaylist playlists={playlists} />
}
