import { NextResponse } from "next/server";
import { firestoreAdmin } from "@/utils/firebaseAdmin";
import { UserPlaylistMap } from "@/utils/types";

export async function GET() {
    try {
        const snapshot = await firestoreAdmin
            .collection("playlists")
            .where("isPublic", "==", true)
            .get();

        const playlists: UserPlaylistMap[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                playlistId: doc.id, // Include the document ID
            } as UserPlaylistMap;
        });

        return NextResponse.json({ ok: true, playlists }, { status: 200 });
    } catch (error) {
        console.error("Error fetching public playlists:", error);
        return NextResponse.json(
            { ok: false, message: "Internal server error." },
            { status: 500 }
        );
    }
}
