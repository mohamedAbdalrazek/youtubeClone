import { NextRequest, NextResponse } from "next/server";
import { forbidden, unauthorized } from "@/utils/responses";
import { authAdmin, firestoreAdmin } from "@/utils/firebaseAdmin";
import { PlaylistMap, UserFavoritePlaylistMap } from "@/utils/types";
import { getYoutubePlaylist } from "@/lib/fetchFunction";
import { checkSavedPlaylist } from "@/lib/serverHelperFunctions";

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
    if (token) decodedToken = await authAdmin.verifyIdToken(token);
    let userData
    let userRef

    if (decodedToken) {
        userRef = firestoreAdmin.collection("users").doc(decodedToken.uid);
        const userDoc = await userRef.get()
        userData = userDoc.data();
    }
    const isPlaylistSaved = userData
        ? checkSavedPlaylist(playlistId, userData.favoritePlaylists)
        : false;
    const getUpdatedPlaylist = (available: boolean, favoritePlaylists: UserFavoritePlaylistMap[], playlist?: PlaylistMap) => {
        const updatedPlaylists = favoritePlaylists.map(p =>
            p.playlistId === playlistId
                ? available && playlist
                    ? {
                        playlistId: playlist.playlistId,
                        title: playlist.title,
                        isAvailable: true,
                        isYoutube: true,
                        thumbnail: playlist.videos[0]?.thumbnail,
                        videoCount: playlist.videos.length,
                    }
                    : { ...p, isAvailable: false }
                : p
        );
        return updatedPlaylists
    };
    if (isYoutube !== "null") {
        try {
            const playlist = await getYoutubePlaylist(playlistId) as PlaylistMap
            if (!playlist || !playlist.videos || playlist.videos.length === 0) {
                if (isPlaylistSaved && userData && userRef) {
                    const updatedPlaylists = getUpdatedPlaylist(false, userData.favoritePlaylists)
                    userRef.update({
                        favoritePlaylists: updatedPlaylists
                    })
                }
                return NextResponse.json(
                    { ok: false, message: "Playlist not found." },
                    { status: 404 }
                );
            }
            if (userData && userRef && isPlaylistSaved) {
                const updatedPlaylists = getUpdatedPlaylist(true, userData.favoritePlaylists, playlist)
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
        const data = playlistDoc.data() ;
        if (!data) {
            if (isPlaylistSaved && userData && userRef) {
                const updatedPlaylists = getUpdatedPlaylist(false, userData.favoritePlaylists)
                userRef.update({
                    favoritePlaylists: updatedPlaylists
                });
            }

            return NextResponse.json(
                { ok: false, message: "Playlist not found." },
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
            const updatedPlaylists = getUpdatedPlaylist(true, userData.favoritePlaylists, playlist)
            userRef.update({
                favoritePlaylists: updatedPlaylists
            });
        }
        if (!data.isPublic) {
            if (!token) return unauthorized("Authentication token is missing.");
            if (!isOwner) {
                return forbidden("You do not have permission to view this playlist.");
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
