import { authAdmin, firestoreAdmin } from "@/utils/firebaseAdmin";
import { badRequest, forbidden, internalServerError, unauthorized } from "@/utils/responses";
import { PlaylistVideoMap, UserPlaylistMap } from "@/utils/types";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    let uid: string, playlistId: string, videoId: string;

    try {
        const body = await request.json();
        uid = body.uid;
        playlistId = body.playlistId;
        videoId = body.videoId;
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return badRequest("Invalid JSON format");
    }

    if (!uid || !playlistId || !videoId) {
        return badRequest("Missing required fields (uid, playlistId, videoId)");
    }

    try {
        const token = request.headers.get("Authorization")?.split(" ")[1];
        if (!token) return unauthorized("Authentication token is missing.");

        const decodedToken = await authAdmin.verifyIdToken(token);
        if (decodedToken.uid !== uid) {
            return forbidden("Unauthorized: UID in token does not match request");
        }
    } catch (authError) {
        console.error("Authentication error:", authError);
        return unauthorized("Authentication failed");
    }

    try {
        // Fetch playlist
        const playlistRef = firestoreAdmin.collection("playlists").doc(playlistId);
        const playlistSnap = await playlistRef.get();

        if (!playlistSnap.exists) {
            return badRequest("Playlist not found");
        }

        const playlistData = playlistSnap.data();
        if (playlistData?.userId !== uid) {
            return forbidden("You do not have permission to modify this playlist.");
        }

        const videos: PlaylistVideoMap[] = playlistData.videos || [];
        const updatedVideos = videos.filter((vid) => vid.videoId !== videoId);

        // Update the playlist document
        await playlistRef.update({ videos: updatedVideos });

        // Update user playlist count
        const userRef = firestoreAdmin.collection("users").doc(uid);
        const userSnap = await userRef.get();
        if (!userSnap.exists) throw new Error("User not found");

        const userData = userSnap.data();
        const playlists: UserPlaylistMap[] = userData?.playlists || [];
        const updatedPlaylists = playlists.map((pl) =>
            pl.playlistId === playlistId
                ? {
                        ...pl,
                        count: Math.max((pl.videoCount || 1) - 1, 0),
                        thumbnail:updatedVideos[0].thumbnail
                    }
                : pl
        );
        await userRef.update({ playlists: updatedPlaylists });

        return Response.json({ ok: true, message: "Video deleted successfully" }, { status: 200 });
    } catch (err) {
        console.error("Error deleting video:", err);
        return internalServerError("Failed to delete the video from the playlist");
    }
}
