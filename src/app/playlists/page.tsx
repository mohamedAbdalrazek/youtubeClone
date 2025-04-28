"use server"
import PlaylistCard from "@/components/PlaylistCard";
import { authAdmin } from "@/utils/firebaseAdmin";
import { PlaylistDocument } from "@/utils/types";
import { cookies } from "next/headers";
import React from "react";

const getPlaylists = async () => {
    const cookieStore = cookies();
    const authToken = (await cookieStore).get("token")?.value;
    if (!authToken) {
        console.error("No auth token found in cookies");
        return { ok: false, message: "No auth token" };
    }

    try {
        await authAdmin.verifyIdToken(authToken);
    } catch (err) {
        console.error("Token verification failed", err);
        return { ok: false, message: "Invalid token" };
    }

    try {
        const res = await fetch(
            `${process.env.ROOT}/api/getFullPlaylists`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                cache: "no-store", // optional: prevents caching in SSR
            }
        );

        return res.json(); // don't forget to extract the actual JSON
    } catch (err) {
        console.error("Failed to fetch playlists:", err);
        return { ok: false, message: "Failed to fetch playlists" };
    }
};

export default async function Page() {
    const { ok, message, playlists } = await getPlaylists();

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
        <div style={{
            padding:"20px",
            display:"flex",
            gap:"13px",
            flexWrap:"wrap",
            justifyContent:"center"
        }}>
            {playlists.map((playlist:PlaylistDocument) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
        </div>
    );
}