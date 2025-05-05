import { searchVideos } from '@/lib/fetchFunction';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get('query');

    try {
        if (!query) {
            return NextResponse.json(
                { error: 'Missing query parameter' },
                { status: 400 }
            );
        }
        const videosList = await searchVideos(query)
        return NextResponse.json({ videosList }, { status: 200 });
    } catch (error) {
        console.error('YouTube search failed:', error);
        return NextResponse.json(
            { error: 'Failed to fetch playlists' },
            { status: 500 }
        );
    }
}