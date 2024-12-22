import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("query")
    if(!query){
        return Response.json({ ok: false, error:"please provide a search query" }, { status: 400 })
    }
    try {
        const res = await fetch(`https://youtube.googleapis.com/youtube/v3/search?q=${query}&maxResults=25&part=snippet&key=${process.env.GOOGLE_API_KEY}`)
        const data = await res.json()
        if(!data){
            return Response.json({ ok: false, error:"somthing went wrong in the server side please try again" }, { status: 500 })
        }
        return Response.json({ ok: true, data }, { status: 200 })
    } catch (error) {
        return Response.json({ ok: false, error }, { status: 500 })

    }
}