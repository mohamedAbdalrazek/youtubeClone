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
        // First check if the video already exists in the playlist
        const playlistDoc = await firestoreAdmin.collection("playlists").doc(playlistId).get();
        if (!playlistDoc.exists) {
            return badRequest("Playlist not found");
        }

        const playlistData = playlistDoc.data();
        const videos: PlaylistVideoMap[] = playlistData?.videos || [];

        // Check if video already exists in playlist
        const videoExists = videos.some(v => v.videoId === video.videoId);
        if (videoExists) {
            return Response.json({ ok: true, message: "Video already exists in playlist" }, { status: 200 });
        }

        // If video doesn't exist, proceed with adding it
        const userRef = firestoreAdmin.collection("users").doc(uid);
        const userDoc = await userRef.get();
        if (!userDoc.exists) throw new Error("User not found");

        const userData = userDoc.data();
        const playlists: UserPlaylistMap[] = userData?.playlists || [];

        const updatedPlaylists = playlists.map((playlist) => {
            if (playlist.playlistId !== playlistId) return playlist;

            return {
                ...playlist,
                videoCount: (playlist.videoCount || 0) + 1,
                thumbnail: playlist.thumbnail || video.thumbnail,
            };
        });

        // Update both documents in a batch to ensure atomicity
        const batch = firestoreAdmin.batch();
        batch.update(userRef, { playlists: updatedPlaylists });
        batch.update(firestoreAdmin.collection("playlists").doc(playlistId), {
            videos: FieldValue.arrayUnion(video)
        });

        await batch.commit();

        return Response.json({ ok: true, message: "Video was added successfully" }, { status: 200 });
    } catch (dbError) {
        console.error("Failed to add document:", dbError);
        return internalServerError("Failed to save the video to the database");
    }
} 