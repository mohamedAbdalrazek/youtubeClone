import { NextRequest, NextResponse } from "next/server";
// import { firestore } from "@/utils/firebase";
import { badRequest, forbidden, internalServerError, notFound, unauthorized } from "@/utils/responses";
import { authAdmin, firestoreAdmin } from "@/utils/firebaseAdmin";
import { UserPlaylistMap } from "@/utils/types";

export async function GET(req: NextRequest) {
    const uid = req.nextUrl.searchParams.get("uid")
    if (!uid) {
        return badRequest("UID is required.")
    }
    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) return unauthorized("Authentication token is missing.");
        const decodedToken = await authAdmin.verifyIdToken(token);
        if (decodedToken.uid !== uid) return forbidden("Unauthorized: UID in token does not match request");
    } catch (authError) {
        console.error("Authentication error:", authError);
        return unauthorized("Authentication failed");
    }
    try {
        const userDocRes = await firestoreAdmin.collection("users").doc(uid).get()
        const data = userDocRes.data();

        if (!data) {
            return notFound("User not found.")
        }

        const playlists: UserPlaylistMap[] = data.playlists || [];

        return NextResponse.json({ ok: true, playlists }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user playlists:", error);
        return internalServerError("Internal server error.")
    }
}
