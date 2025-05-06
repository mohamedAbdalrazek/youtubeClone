import { searchPlaylists, searchVideos } from '@/lib/fetchFunction';
import { PlaylistResultMap, VideoResultMap } from '@/utils/types';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get('query');
    const type = request.nextUrl.searchParams.get('type');

    try {
        if (!query) {
            return NextResponse.json(
                { error: 'Missing query parameter' },
                { status: 400 }
            );
        }
        
        if (type === "playlist") {
            const playlists = await searchPlaylists(query) as PlaylistResultMap[]
            return NextResponse.json({ playlists }, { status: 200 });
        } else{
            const videosList = await searchVideos(query) as VideoResultMap[]
            return NextResponse.json({ videosList }, { status: 200 });
        }
    } catch (error) {
        console.error('YouTube search failed:', error);
        return NextResponse.json(
            { error: 'Failed to fetch playlists' },
            { status: 500 }
        );
    }
}