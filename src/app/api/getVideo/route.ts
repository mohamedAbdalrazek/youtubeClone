import { getVideoDetails } from "@/lib/fetchFunction";
import { WatchVideoMap } from "@/utils/types";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const videoId = request.nextUrl.searchParams.get("videoId")
    if (!videoId) {
        return Response.json({ ok: false, error: "please provide a video id" }, { status: 400 })
    }
    try {
        const videoDetails = await getVideoDetails(videoId) as WatchVideoMap;
        if (!videoDetails) {
            return Response.json({ error: "Video not found" }, { status: 404 });
        }
        return Response.json({ ok: true, data: videoDetails })
    } catch (error) {
        return Response.json({ ok: false, error }, { status: 500 })
    }

}