import { authAdmin, firestoreAdmin } from "@/utils/firebaseAdmin";
import { badRequest, forbidden, internalServerError, unauthorized } from "@/utils/responses";
import { PlaylistVideoMap, UserPlaylistMap } from "@/utils/types";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    let uid, playlistId, video: PlaylistVideoMap;
    try {
        const body = await request.json();
        uid = body.uid;
        playlistId = body.playlistId;
        video = body.video;
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return badRequest("Invalid JSON format");
    }

    const requiredFields = [uid, playlistId, video.channelTitle, video.thumbnail, video.videoId, video.title];
    if (requiredFields.some(field => !field)) {
        console.error("Missing required data");
        return badRequest("Please provide all the required data");
    }

    try {
        const token = request.headers.get("Authorization")?.split(" ")[1];
        if (!token) return unauthorized("Authentication token is missing.");

        const decodedToken = await authAdmin.verifyIdToken(token);
        if (decodedToken.uid !== uid) return forbidden("Unauthorized: UID in token does not match request");
    } catch (authError) {
        console.error("Authentication error:", authError);
        return unauthorized("Authentication failed");
    }

    try {
        const userRef = firestoreAdmin.collection("users").doc(uid);
        const userDoc = await userRef.get()
        if (!userDoc.exists) throw new Error("User not found");

        const userData = userDoc.data();
        const playlists: UserPlaylistMap[] = userData?.playlists || [];

        const updatedPlaylists = playlists.map((playlist) => {
            if (playlist.playlistId !== playlistId) return playlist;

            return {
                ...playlist,
                count: (playlist.count || 0) + 1,
                thumbnail: playlist.thumbnail || video.thumbnail,
            };
        });
        await userRef.update({ playlists: updatedPlaylists });
        await firestoreAdmin.collection("playlists").doc(playlistId).update({ videos: FieldValue.arrayUnion(video) })

        return Response.json({ ok: true, message: "Video was added successfully" }, { status: 200 });
    } catch (dbError) {
        console.error("Failed to add document:", dbError);
        return internalServerError("Failed to save the video to the database");
    }
}
