import { NextRequest, NextResponse } from "next/server";
import { badRequest, forbidden, internalServerError, notFound, unauthorized } from "@/utils/responses";
import { authAdmin, firestoreAdmin } from "@/utils/firebaseAdmin";
import { PlaylistMap } from "@/utils/types";
import { getYoutubePlaylist } from "@/lib/fetchFunction";
import { checkSavedPlaylist } from "@/lib/serverHelperFunctions";
import { getUpdatedPlaylist } from "@/lib/searchFunctions";

export async function GET(req: NextRequest) {
    const playlistId = req.nextUrl.searchParams.get("playlistId")
    const isYoutube = req.nextUrl.searchParams.get("youtube")

    if (!playlistId) {
        return badRequest("Playlist id is required.")
    }
    let uid = null;

    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (token){
            const decodedToken = await authAdmin.verifyIdToken(token);
            uid = decodedToken.uid
        }
    } catch (authError) {
        console.error("Authentication error:", authError);
    }
    let userData = null
    let userRef = null

    if (uid) {
        userRef = firestoreAdmin.collection("users").doc(uid);
        const userDoc = await userRef.get()
        userData = userDoc.data();
    }
    const isPlaylistSaved = userData?.favoritePlaylists
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
                    return notFound("This playlist was deleted or set to private." )
                }
                return notFound("This playlist is not found" )
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
            return internalServerError ("Internal server error." )
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
                return notFound("This playlist was deleted.")
            }
            return notFound("This playlist is not found." )
        }

        const isOwner = uid ? data.userId === uid : false;
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
            if (!uid) return unauthorized("This playlist is private.");
            if (!isOwner) {
                return forbidden("This playlist is private.");
            }
        }
        return NextResponse.json({ ok: true, playlist }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user playlists:", error);
        return internalServerError("Internal server error." )
    }
}
