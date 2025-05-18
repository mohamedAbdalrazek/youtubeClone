import { cookies } from "next/headers";
import React from "react";
import Playlists from "./Playlists";

const getPlaylists = async () => {
    const cookieStore = cookies();
    const authToken = (await cookieStore).get("token")?.value;
    if (!authToken) {
        console.error("No auth token found in cookies");
        return { ok: false, message: "No auth token" };
    }

    try {
        const res = await fetch(`${process.env.ROOT}/api/getFullPlaylists`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            next: { revalidate: 60 },
        });

        return res.json();
    } catch (err) {
        console.error("Failed to fetch playlists:", err);
        return { ok: false, message: "Failed to fetch playlists" };
    }
};

export default async function Page() {
    const { ok, message, myPlaylists, favPlaylists } = await getPlaylists();

    if (!ok) {
        return (
            <div>
                <p>{message || "Something went wrong."}</p>
            </div>
        );
    }

    if (!myPlaylists || myPlaylists.length === 0) {
        return (
            <div>
                <p>No playlists found.</p>
            </div>
        );
    }

    return (
        <>
            <Playlists header="My Playlists" playlists={myPlaylists} />
            <Playlists header="Saved Playlists" playlists={favPlaylists} />
        </>
    );
}
