import { authAdmin, firestoreAdmin } from "@/utils/firebaseAdmin";
import { badRequest, forbidden, internalServerError, unauthorized } from "@/utils/responses";
import { NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { UserPlaylistMap } from "@/utils/types";

export async function DELETE(request: NextRequest) {
    let data;
    try {
        data = await request.json();
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return badRequest("Invalid JSON format");
    }

    const { uid, playlistId } = data;

    if (!uid || !playlistId) {
        return badRequest("Missing UID or playlist ID");
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
        const userDoc = await userRef.get();

        if (!userDoc.exists) return badRequest("User not found");

        const userData = userDoc.data();
        const playlists = userData?.playlists || [];

        const targetPlaylist = playlists.find((p:UserPlaylistMap) => p.playlistId === playlistId);
        if (!targetPlaylist) return badRequest("Playlist not found in user's list");

        // Remove from user's playlists array
        await userRef.update({
            playlists: FieldValue.arrayRemove(targetPlaylist),
        });

        // Remove from main playlists collection
        await firestoreAdmin.collection("playlists").doc(playlistId).delete();

        return Response.json({ ok: true, message: "Playlist deleted successfully" }, { status: 200 });
    } catch (dbError) {
        console.error("Failed to delete playlist:", dbError);
        return internalServerError("Failed to delete playlist");
    }
}
