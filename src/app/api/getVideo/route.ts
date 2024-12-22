import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const videoId = request.nextUrl.searchParams.get("videoId")
    if(!videoId){
        return Response.json({ ok: false, error:"please provide a video id" }, { status: 400 })
    }
    try{

        const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${process.env.GOOGLE_API_KEY}`)
        const data = await res.json()
        if(!data){
            return Response.json({ ok: false, error:"somthing went wrong in the server side please try again" }, { status: 500 })
        }
        return Response.json({ok:true, data})
    }catch(error){
        return Response.json({ ok: false, error}, { status: 500 })
    }

}