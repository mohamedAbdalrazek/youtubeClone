import { searchPlaylists, searchVideos } from '@/lib/fetchFunction';
import { PlaylistResultMap, VideoResultMap } from '@/utils/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const query = request.nextUrl.searchParams.get('query');
        const type = request.nextUrl.searchParams.get('type');

        if (!query) {
            return NextResponse.json(
                { error: 'Search term is required.' },
                { status: 400 }
            );
        }

        if (type === 'playlist') {
            const playlists = await searchPlaylists(query) as PlaylistResultMap[];
            return NextResponse.json({ playlists });
        } else if (type === 'video') {
            const videosList = await searchVideos(query) as VideoResultMap[];
            return NextResponse.json({ videosList });
        } else {
            return NextResponse.json(
                { error: 'Invalid search type. Must be "playlist" or "video".' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json(
            { error: 'Something went wrong while searching. Please try again later.' },
            { status: 500 }
        );
    }
}
