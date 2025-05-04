import { NextRequest, NextResponse } from "next/server";
// import { firestore } from "@/utils/firebase";
import { forbidden, unauthorized } from "@/utils/responses";
import { authAdmin, firestoreAdmin } from "@/utils/firebaseAdmin";
import {  UserPlaylistMap } from "@/utils/types";

export async function GET(req: NextRequest) {
    let uid
    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) return unauthorized("Authentication token is missing.");
        const decodedToken = await authAdmin.verifyIdToken(token);
        if (!decodedToken.uid) return forbidden("Unauthorized: UID in token does not match request");
        uid = decodedToken.uid
    } catch (authError) {
        console.error("Authentication error:", authError);
        return unauthorized("Authentication failed");
    }
    try {
        const userRef = firestoreAdmin.collection("users").doc(uid);
        const userDoc = await userRef.get()
        if (!userDoc.exists) throw new Error("User not found");

        const userData = userDoc.data();
        if (!userData) {
            return NextResponse.json(
                { ok: false, message: "User not found." },
                { status: 404 }
            );
        }
        const playlists: UserPlaylistMap[] = userData?.playlists || [];
        return NextResponse.json({ ok: true, playlists: playlists }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user playlists:", error);
        return NextResponse.json(
            { ok: false, message: "Internal server error." },
            { status: 500 }
        );
    }
}
