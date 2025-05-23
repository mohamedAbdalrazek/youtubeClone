"use server";
import { cookies } from "next/headers";
import React from "react";
import Playlists from "./Playlists";
import NotFound from "../not-found";
import styles from "./PlaylistsPage.module.css"
const getPlaylists = async () => {
    const cookieStore = cookies();
    const authToken = (await cookieStore).get("token")?.value;

    if (!authToken) {
        return {
            ok: false,
            message:
                "You're not signed in. Please log in to view your playlists.",
            status: 401,
        };
    }

    try {
        const res = await fetch(`${process.env.ROOT}/api/getFullPlaylists`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            cache: "no-cache",
        });

        const json = await res.json();

        if (!res.ok) {
            return {
                ok: false,
                message: json?.message || "Failed to load playlists.",
                status: res.status,
            };
        }

        return {
            ok: true,
            myPlaylists: json.myPlaylists,
            favPlaylists: json.favPlaylists,
        };
    } catch (err) {
        console.error("Unexpected error fetching playlists:", err);
        return {
            ok: false,
            message: "Something went wrong while contacting the server.",
            status: 500,
        };
    }
};

export default async function Page() {
    const { ok, message, status, myPlaylists, favPlaylists } =
        await getPlaylists();

    if (!ok) {
        return <NotFound statusCode={status} errorMessage={message} />;
    }
    if(!myPlaylists?.legnth && !favPlaylists?.length){
        return (
            <div className={styles.noPlaylistsFound}>
                <p>
                    You have no playlists
                </p>
            </div>
        )
    }
    return (
        <>
            {myPlaylists && myPlaylists.length !== 0 && (
                <Playlists header="My Playlists" playlists={myPlaylists} />
            )}
            {favPlaylists && favPlaylists.length !== 0 && (
                <Playlists header="Saved Playlists" playlists={favPlaylists} />
            )}
        </>
    );
}
