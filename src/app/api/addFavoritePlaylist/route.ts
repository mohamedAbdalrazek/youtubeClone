import { authAdmin, firestoreAdmin } from "@/utils/firebaseAdmin";
import { badRequest, forbidden, internalServerError, unauthorized } from "@/utils/responses";
import { UserFavoritePlaylistMap } from "@/utils/types";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    let data;
    try {
        data = await request.json();
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return badRequest("Invalid JSON format")
    }
    const newPlaylist: UserFavoritePlaylistMap = data.newPlaylist
    console.log(data)
    const requiredFields = [data.uid, newPlaylist.title, newPlaylist.thumbnail, newPlaylist.playlistId, newPlaylist.videoCount];
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
        await firestoreAdmin.runTransaction(async (transaction) => {
            const userRef = firestoreAdmin.collection("users").doc(data.uid);
            const userDoc = await transaction.get(userRef);

            if (!userDoc.exists) {
                throw new Error("User not found");
            }

            const currentPlaylists = userDoc.data()?.favoritePlaylists || [];
            const updatedPlaylists = currentPlaylists.filter(
                (p: UserFavoritePlaylistMap) => p.playlistId !== newPlaylist.playlistId
            );

            updatedPlaylists.push(newPlaylist);

            transaction.update(userRef, {
                favoritePlaylists: updatedPlaylists
            });
        });

        return Response.json({
            ok: true,
            message: "Playlist was updated successfully"
        }, { status: 200 });
    } catch (dbError) {
        console.error("Failed to add document:", dbError);
        return internalServerError("Failed to save the playlist to the database")
    }
}

