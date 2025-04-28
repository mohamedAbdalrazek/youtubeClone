import { authAdmin, firestoreAdmin } from "@/utils/firebaseAdmin";
import { badRequest, forbidden, internalServerError, unauthorized } from "@/utils/responses";
import { Playlist, PlaylistDocument } from "@/utils/types";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    let data;
    try {
        data = await request.json();
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return badRequest("Invalid JSON format")
    }
    const newPlaylist: Playlist = data.newPlaylist
    const requiredFields = [data.uid, data.userName, newPlaylist?.visibility, newPlaylist?.title];
    if (requiredFields.some(field => !field)) {
        console.error("Missing required data");

        return badRequest("Please provide all the required data")
    }
    try {
        const token = request.headers.get("Authorization")?.split(" ")[1];
        if (!token) return unauthorized("Authentication token is missing.");
        const decodedToken = await authAdmin.verifyIdToken(token);
        const uidFromToken = decodedToken.uid;
        const uidFromRequest = data.uid;
        if (uidFromToken !== uidFromRequest) return forbidden("Unauthorized: UID in token does not match request");
    } catch (authError) {
        console.error("Authentication error:", authError);
        return unauthorized("Authentication failed")
    }

    try {
        await firestoreAdmin.collection("users").doc(data.uid).update({
            playlists: FieldValue.arrayUnion(newPlaylist)
        })

        const playlistDoc: PlaylistDocument = {
            title: newPlaylist.title,
            userName: data.userName,
            createdAt: new Date().toISOString(),
            userId: data.uid,
            videos: [],
            isPublic: newPlaylist.visibility === "public"

        }
        await firestoreAdmin.collection("playlists").doc(newPlaylist.playlistId).set(playlistDoc)

        return Response.json({ ok: true, message: "playlist was added successfully" }, {
            status: 200
        });
    } catch (dbError) {
        console.error("Failed to add document:", dbError);
        return internalServerError("Failed to save the playlist to the database")
    }
}

