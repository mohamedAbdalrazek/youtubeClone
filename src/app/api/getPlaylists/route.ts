import { NextRequest, NextResponse } from "next/server";
// import { firestore } from "@/utils/firebase";
import { forbidden, unauthorized } from "@/utils/responses";
import { authAdmin, firestoreAdmin } from "@/utils/firebaseAdmin";

export async function GET(req: NextRequest) {
    const uid = req.nextUrl.searchParams.get("uid")
    if (!uid) {
        return NextResponse.json(
            { error: "UID is required." },
            { status: 400 }
        );
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
            return NextResponse.json(
                { ok: false, message: "User not found." },
                { status: 404 }
            );
        }

        const playlists = data.playlists || [];

        return NextResponse.json({ ok: true, playlists }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user playlists:", error);
        return NextResponse.json(
            { ok: false, message: "Internal server error." },
            { status: 500 }
        );
    }
}
