import { authAdmin, firestoreAdmin } from "@/utils/firebaseAdmin";
import { badRequest, forbidden, internalServerError, unauthorized } from "@/utils/responses";
import { UserPlaylistMap } from "@/utils/types";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest) {
    let uid, playlistId, visibility: 'public' | 'private';
    try {
        const body = await request.json();
        uid = body.uid;
        playlistId = body.playlistId;
        visibility = body.visibility;
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return badRequest("Invalid JSON format");
    }

    const requiredFields = [uid, playlistId, visibility];
    if (requiredFields.some(field => !field)) {
        console.error("Missing required data");
        return badRequest("Please provide all the required data");
    }

    if (visibility !== 'public' && visibility !== 'private') {
        return badRequest("Visibility must be either 'public' or 'private'");
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
        const playlistDoc = await firestoreAdmin.collection("playlists").doc(playlistId).get();
        if (!playlistDoc.exists) {
            return badRequest("Playlist not found");
        }

        const playlistData = playlistDoc.data();
        if (playlistData?.userId !== uid) {
            return forbidden("You don't have permission to modify this playlist");
        }

        const batch = firestoreAdmin.batch();

        const userRef = firestoreAdmin.collection("users").doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return badRequest("User not found");
        }

        const userData = userDoc.data();
        const playlists: UserPlaylistMap[] = userData?.playlists || [];

        const updatedPlaylists = playlists.map(playlist => {
            if (playlist.playlistId === playlistId) {
                return {
                    ...playlist,
                    visibility: visibility
                };
            }
            return playlist;
        });
        batch.update(userRef, {
            playlists: updatedPlaylists
        });
        const playlistRef = firestoreAdmin.collection("playlists").doc(playlistId);
        batch.update(playlistRef, {
            isPublic: visibility === 'public'
        });

        await batch.commit();

        return Response.json({
            ok: true,
            message: "Playlist visibility updated successfully",
            visibility
        }, { status: 200 });
    } catch (dbError) {
        console.error("Failed to update playlist visibility:", dbError);
        return internalServerError("Failed to update playlist visibility");
    }
}