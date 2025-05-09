import { NextRequest, NextResponse } from "next/server";
// import { firestore } from "@/utils/firebase";
import { forbidden, unauthorized } from "@/utils/responses";
import { authAdmin, firestoreAdmin } from "@/utils/firebaseAdmin";
import { PlaylistMap } from "@/utils/types";
import { getYoutubePlaylist } from "@/lib/fetchFunction";

// async function fetchAllPlaylistItems(playlistId: string) {
//     let nextPageToken = "";
//     const allItems = [];

//     do {
//         const res = await fetch(
//             `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${process.env.GOOGLE_API_KEY}`
//         );
//         const data = await res.json();

//         if (data.error) {
//             throw new Error(data.error.message || "YouTube API error");
//         }

//         if (Array.isArray(data.items)) {
//             allItems.push(...data.items);
//         }

//         nextPageToken = data.nextPageToken || "";

//     } while (nextPageToken);

//     return allItems;
// }
export async function GET(req: NextRequest) {
    const playlistId = req.nextUrl.searchParams.get("playlistId")
    const isYoutube = req.nextUrl.searchParams.get("youtube")
    if (!playlistId) {
        return NextResponse.json(
            { error: "Playlist id is required." },
            { status: 400 }
        );
    }
    if (isYoutube !== "null") {
        try {
            const playlist = await getYoutubePlaylist(playlistId) as PlaylistMap
            if (!playlist || !playlist.videos || playlist.videos.length === 0) {
                return NextResponse.json(
                    { ok: false, message: "Playlist not found." },
                    { status: 404 }
                );
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
    try {
        const playlistDoc = await firestoreAdmin.collection("playlists").doc(playlistId).get()
        const data = playlistDoc.data();
        if (!data) {
            return NextResponse.json(
                { ok: false, message: "Playlist not found." },
                { status: 404 }
            );
        }
        if (!data.isPublic) {
            try {
                const token = req.headers.get("Authorization")?.split(" ")[1];
                if (!token) return unauthorized("Authentication token is missing.");
                const decodedToken = await authAdmin.verifyIdToken(token);
                if (data.userId !== decodedToken.uid) {
                    return forbidden("You do not have permission to view this playlist.");
                }
            } catch (authError) {
                console.error("Authentication error:", authError);
                return unauthorized("Authentication failed");
            }
        }
        const playlistWithoutUserId = Object.fromEntries(
            Object.entries(data).filter(([key]) => key !== "userId")
        )
        const playlist = {
            ...playlistWithoutUserId,
            playlistId :playlistDoc.id,
            isOwner: false,
            isFav: false,
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
