import { getVideoDetails } from "@/lib/fetchFunction";
import { WatchVideoMap } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const videoId = request.nextUrl.searchParams.get("videoId");

    if (!videoId) {
        return NextResponse.json(
            { error: "Please provide a video ID." },
            { status: 400 }
        );
    }

    try {
        const videoDetails = await getVideoDetails(videoId) as WatchVideoMap;
        console.log(videoDetails)
        if (!videoDetails) {
            return NextResponse.json(
                { error: "The requested video could not be found." },
                { status: 404 }
            );
        }

        return NextResponse.json({ ok: true, data: videoDetails }, { status: 200 });

    } catch (error) {
        console.error("Error fetching video details:", error);
        return NextResponse.json(
            { error: "Something went wrong while retrieving video data. Please try again later." },
            { status: 500 }
        );
    }
}
