import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const videoId = request.nextUrl.searchParams.get("videoId")
    if (!videoId) {
        return Response.json({ ok: false, error: "please provide a video id" }, { status: 400 })
    }
    try {

        const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${process.env.GOOGLE_API_KEY}`)
        const data = await res.json()
        if (!data) {
            return Response.json({ ok: false, error: "somthing went wrong in the server side please try again" }, { status: 500 })
        }
        const items = data.items
        const cleanedData = items.map((item: {
            id: string, snippet: {
                description: string, channelTitle: string,
                title: string,
                publishedAt: string,
                thumbnails: {
                    high: {
                        url: string,
                        width: number;
                        height: number
                    }
                }
            }, statistics: { viewCount: number }
        }) => ({
            id: item.id,
            description: item.snippet.description,
            channelTitle: item.snippet.channelTitle,
            title: item.snippet.title,
            date: item.snippet.publishedAt,
            viewCount: item.statistics.viewCount,
            url:item.snippet.thumbnails.high.url,
            height:item.snippet.thumbnails.high.height,
            width:item.snippet.thumbnails.high.width
        }))
        return Response.json({ ok: true, data: cleanedData })
    } catch (error) {
        return Response.json({ ok: false, error }, { status: 500 })
    }

}