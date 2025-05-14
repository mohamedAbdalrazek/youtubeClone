import { authAdmin, firestoreAdmin } from "@/utils/firebaseAdmin";
import { badRequest, forbidden, internalServerError, unauthorized } from "@/utils/responses";
import { NewPlaylistMap, PlaylistVideoMap, UserPlaylistMap } from "@/utils/types";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    let uid, userName, video: PlaylistVideoMap;
    try {
        const body = await request.json();
        uid = body.uid;
        video = body.video;
        userName = body.userName
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return badRequest("Invalid JSON format");
    }

    const requiredFields = [uid, video.channelTitle, video.thumbnail, video.videoId, video.title];
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
        let playlistId;
        let shouldAddVideo = true;

        playlists.forEach((playlist) => {
            if (playlist.title !== "Watch later") return;
            playlistId = playlist.playlistId;
        });

        if (playlistId) {
            const playlistDoc = await firestoreAdmin.collection("playlists").doc(playlistId).get();
            const playlistData = playlistDoc.data() as NewPlaylistMap;

            const videoExists = playlistData.videos.some(v => v.videoId === video.videoId);
            if (videoExists) {
                shouldAddVideo = false;
            }
        }

        if (!shouldAddVideo) {
            return Response.json({ ok: true, message: "Video already exists in playlist" }, { status: 200 });
        }

        if (!playlistId) {
            playlistId = crypto.randomUUID()
            const newPlaylist: UserPlaylistMap = {
                title: "Watch later",
                playlistId,
                thumbnail: video.thumbnail,
                visibility: "private",
                count: 1
            }
            await firestoreAdmin.collection("users").doc(uid).update({
                playlists: FieldValue.arrayUnion(newPlaylist)
            })

            const playlistDoc: NewPlaylistMap = {
                title: newPlaylist.title,
                creator: userName,
                createdAt: new Date().toISOString(),
                userId: uid,
                videos: [video],
                isPublic: newPlaylist.visibility === "public"
            }
            await firestoreAdmin.collection("playlists").doc(newPlaylist.playlistId).set(playlistDoc)
            return Response.json({ ok: true, message: "Playlist was created and video was added successfully" }, {
                status: 200
            });
        }

        const finalUpdatedPlaylists = playlists.map((playlist) => {
            if (playlist.title !== "Watch later") return playlist;
            return {
                ...playlist,
                count: (playlist.count || 0) + 1,
                thumbnail: playlist.thumbnail || video.thumbnail,
            };
        });

        await userRef.update({ playlists: finalUpdatedPlaylists });
        await firestoreAdmin.collection("playlists").doc(playlistId).update({
            videos: FieldValue.arrayUnion(video)
        });

        return Response.json({ ok: true, message: "Video was added successfully" }, { status: 200 });
    } catch (dbError) {
        console.error("Failed to add document:", dbError);
        return internalServerError("Failed to save the video to the database");
    }
}