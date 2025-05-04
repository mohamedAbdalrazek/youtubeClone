import { SearchResultMap } from "@/utils/types";
import { NextRequest } from "next/server";
type Item = {
    id: {
        kind: "youtube#playlist" | "youtube#video",
        videoId?: string
        playlistId?: string
    },
    snippet: {
        title: string,
        publishedAt: string,
        channelTitle: string,
        thumbnails: {
            high: {
                url: string,
                width: number;
                height: number
            }
        }
    }
}
export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("query")
    if (!query) {
        return Response.json({ ok: false, error: "please provide a search query" }, { status: 400 })
    }
    try {
        const res = await fetch(`https://youtube.googleapis.com/youtube/v3/search?q=${query}&type=video,playlist&maxResults=25&part=snippet&key=${process.env.GOOGLE_API_KEY}`)
        const data = await res.json()
        if (!data) {
            return Response.json({ ok: false, error: "somthing went wrong in the server side please try again" }, { status: 500 })
        }
        const formedData = data.items.map((item: Item) => {
            const type = item.id.kind === "youtube#playlist" ? "playlist" : "video"
            return {
                type,
                videoId: item.id.videoId,
                playlistId: item.id.playlistId,
                title: item.snippet.title,
                date: item.snippet.publishedAt,
                thumbnail: item.snippet.thumbnails.high.url,
                channelTitle: item.snippet.channelTitle
            } as SearchResultMap
        })

        return Response.json({ ok: true, formedData }, { status: 200 })
    } catch (error) {
        return Response.json({ ok: false, error }, { status: 500 })

    }
}

