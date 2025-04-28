import { authAdmin, firestoreAdmin } from "@/utils/firebaseAdmin";
import { badRequest, forbidden, internalServerError, unauthorized } from "@/utils/responses";
import { Video } from "@/utils/types";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    let uid, playlistId, video: Video;
    try {
        const body = await request.json();
        uid = body.uid;
        playlistId = body.playlistId;
        video = body.video;
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return badRequest("Invalid JSON format");
    }

    const requiredFields = [uid, playlistId, video?.channelTitle, video?.date, video?.url, video?.videoId, video?.title];
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
        await firestoreAdmin.collection("playlists").doc(playlistId).update({ videos: FieldValue.arrayUnion(video) })

        return Response.json({ ok: true, message: "Video was added successfully" }, { status: 200 });
    } catch (dbError) {
        console.error("Failed to add document:", dbError);
        return internalServerError("Failed to save the video to the database");
    }
}
