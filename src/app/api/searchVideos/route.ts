import { NextRequest } from "next/server";
type Item = {
    id: {
        videoId: string
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
        const res = await fetch(`https://youtube.googleapis.com/youtube/v3/search?q=${query}&maxResults=25&part=snippet&key=${process.env.GOOGLE_API_KEY}`)
        const data = await res.json()
        if (!data) {
            return Response.json({ ok: false, error: "somthing went wrong in the server side please try again" }, { status: 500 })
        }
        const formedData = data.items.map((item: Item) => {

            return {
                videoId: item.id.videoId,
                title: item.snippet.title,
                date: item.snippet.publishedAt,
                url: item.snippet.thumbnails.high.url,
                height: item.snippet.thumbnails.high.height,
                width: item.snippet.thumbnails.high.width,
                channelTitle: item.snippet.channelTitle
            }
        })

        return Response.json({ ok: true, formedData }, { status: 200 })
    } catch (error) {
        return Response.json({ ok: false, error }, { status: 500 })

    }
}

