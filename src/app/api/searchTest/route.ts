import { getYoutubePlaylist } from "@/lib/fetchFunction";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const playlistId = searchParams.get("playlistId");
    if (!playlistId) {
        return Response.json({ error: "playlistId is required" }, { status: 400 });
    }
    const playlist = await getYoutubePlaylist(playlistId)

    return Response.json({ playlist }, { status: 200 });
}