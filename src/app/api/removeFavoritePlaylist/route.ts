import { authAdmin, firestoreAdmin } from "@/utils/firebaseAdmin";
import { badRequest, forbidden, internalServerError, unauthorized } from "@/utils/responses";
import { UserFavoritePlaylistMap } from "@/utils/types";
import { NextRequest } from "next/server";

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
        return badRequest("uid and playlistId are required");
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
        const favoritePlaylists: UserFavoritePlaylistMap[] = userData?.favoritePlaylists || [];

        const updatedFavorites = favoritePlaylists.filter(p => p.playlistId !== playlistId);

        await userRef.update({ favoritePlaylists: updatedFavorites });

        return Response.json({ ok: true, message: "Playlist removed successfully" }, { status: 200 });
    } catch (dbError) {
        console.error("Failed to remove playlist:", dbError);
        return internalServerError("Failed to update the playlist list");
    }
}
