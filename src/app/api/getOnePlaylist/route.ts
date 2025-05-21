import { NextRequest, NextResponse } from "next/server";
import { forbidden, unauthorized } from "@/utils/responses";
import { authAdmin, firestoreAdmin } from "@/utils/firebaseAdmin";
import { PlaylistMap } from "@/utils/types";
import { getYoutubePlaylist } from "@/lib/fetchFunction";
import { checkSavedPlaylist } from "@/lib/serverHelperFunctions";
import { getUpdatedPlaylist } from "@/lib/searchFunctions";

export async function GET(req: NextRequest) {
    const playlistId = req.nextUrl.searchParams.get("playlistId")
    const isYoutube = req.nextUrl.searchParams.get("youtube")

    if (!playlistId) {
        return NextResponse.json(
            { error: "Playlist id is required." },
            { status: 400 }
        );
    }
    const token = req.headers.get("Authorization")?.split(" ")[1];
    let decodedToken;
    try {
        if (token) {
            decodedToken = await authAdmin.verifyIdToken(token);
        }
    } catch (err) {
        console.error("Failed to verify token:", err);
    }
    let userData = null
    let userRef = null

    if (decodedToken) {
        userRef = firestoreAdmin.collection("users").doc(decodedToken.uid);
        const userDoc = await userRef.get()
        userData = userDoc.data();
    }
    const isPlaylistSaved = userData
        ? checkSavedPlaylist(playlistId, userData.favoritePlaylists)
        : false;

    if (isYoutube !== "null") {
        try {
            const playlist = await getYoutubePlaylist(playlistId) as PlaylistMap
            if (!playlist?.videos?.length) {
                if (isPlaylistSaved && userData && userRef) {
                    const updatedPlaylists = getUpdatedPlaylist(false, playlistId, userData.favoritePlaylists)
                    userRef.update({
                        favoritePlaylists: updatedPlaylists
                    })
                    return NextResponse.json(
                        { ok: false, message: "This playlist was deleted or set to private." },
                        { status: 404 }
                    );
                }
                return NextResponse.json(
                    { ok: false, message: "This playlist is not found" },
                    { status: 404 }
                );
            }
            if (userData && userRef && isPlaylistSaved) {
                const updatedPlaylists = getUpdatedPlaylist(true, playlistId, userData.favoritePlaylists, playlist)
                userRef.update({
                    favoritePlaylists: updatedPlaylists
                });
            }
            return NextResponse.json({ ok: true, playlist: { ...playlist, isOwner: false } }, { status: 200 });

        } catch (error) {
            console.error("Error fetching user playlists:", error);
            return NextResponse.json(
                { ok: false, message: "Internal server error." },
                { status: 500 }
            );
        }
    }
    try {
        const playlistDoc = await firestoreAdmin.collection("playlists").doc(playlistId).get()
        const data = playlistDoc.data();
        if (!data) {
            if (isPlaylistSaved && userData && userRef) {
                const updatedPlaylists = getUpdatedPlaylist(false, playlistId, userData.favoritePlaylists)
                userRef.update({
                    favoritePlaylists: updatedPlaylists
                });
                return NextResponse.json(
                    { ok: false, message: "This playlist was deleted." },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { ok: false, message: "This playlist is not found." },
                { status: 404 }
            );
        }

        const isOwner = decodedToken ? data.userId === decodedToken.uid : false;
        const playlistWithoutUserId = Object.fromEntries(
            Object.entries(data).filter(([key]) => key !== "userId")
        ) as PlaylistMap
        const playlist = {
            ...playlistWithoutUserId,
            playlistId: playlistDoc.id,
            isOwner
        }
        if (userData && userRef && isPlaylistSaved && !isOwner) {
            const updatedPlaylists = getUpdatedPlaylist(true, playlistId, userData.favoritePlaylists, playlist)
            userRef.update({
                favoritePlaylists: updatedPlaylists
            });
        }
        if (!data.isPublic) {
            if (!token) return unauthorized("This playlist is private.");
            if (!isOwner) {
                return forbidden("This playlist is private.");
            }
        }



        return NextResponse.json({ ok: true, playlist }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user playlists:", error);
        return NextResponse.json(
            { ok: false, message: "Internal server error." },
            { status: 500 }
        );
    }
}
