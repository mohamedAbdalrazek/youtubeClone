import { NextRequest, NextResponse } from "next/server";
// import { firestore } from "@/utils/firebase";
import { forbidden, unauthorized } from "@/utils/responses";
import { authAdmin, firestoreAdmin } from "@/utils/firebaseAdmin";

export async function GET(req: NextRequest) {
    const playlistId = req.nextUrl.searchParams.get("playlistId")
    if (!playlistId) {
        return NextResponse.json(
            { error: "Playlist id is required." },
            { status: 400 }
        );
    }
    try {
        const playlistDoc = await firestoreAdmin.collection("playlists").doc(playlistId).get()
        const playlist = playlistDoc.data();
        if (!playlist) {
            return NextResponse.json(
                { ok: false, message: "Playlist not found." },
                { status: 404 }
            );
        }
        if (!playlist.isPublic) {
            try {
                const token = req.headers.get("Authorization")?.split(" ")[1];
                if (!token) return unauthorized("Authentication token is missing.");
                const decodedToken = await authAdmin.verifyIdToken(token);
                if (playlist.userId !== decodedToken.uid) {
                    return forbidden("You do not have permission to view this playlist.");
                }
            } catch (authError) {
                console.error("Authentication error:", authError);
                return unauthorized("Authentication failed");
            }
        }
        const playlistWithoutUserId = Object.fromEntries(
            Object.entries(playlist).filter(([key]) => key !== "userId")
        )
        return NextResponse.json({ ok: true, playlist:playlistWithoutUserId }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user playlists:", error);
        return NextResponse.json(
            { ok: false, message: "Internal server error." },
            { status: 500 }
        );
    }


}
