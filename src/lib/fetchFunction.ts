import { PlaylistResultMap, VideoResultMap } from '@/utils/types';
import { Innertube } from 'youtubei.js';

interface Thumbnail {
    url: string;
    width: number;
    height: number;
}

interface Badge {
    text: string;
    badge_style: string;
}

interface ThumbnailOverlay {
    badges?: Badge[];
}

interface TextRun {
    text: string;
    bold?: boolean;
    // Add other text properties if needed
}

interface MetadataPart {
    text?: {
        runs?: TextRun[];
    };
}

interface MetadataRow {
    metadata_parts?: MetadataPart[];
}

interface PlaylistMetadata {
    metadata_rows?: MetadataRow[];
}

interface PlaylistTitle {
    text?: string;
    runs?: TextRun[];
}

interface PlaylistContentImage {
    primary_thumbnail?: {
        image?: Thumbnail[];
        overlays?: ThumbnailOverlay[];
    };
}

interface PlaylistItem {
    type: string;
    content_image?: PlaylistContentImage;
    metadata?: {
        title?: PlaylistTitle;
        metadata?: PlaylistMetadata;
    };
    content_id?: string;
}

interface TextRun {
    text: string;
    bold?: boolean;
}

interface VideoTitle {
    text?: string;
    runs?: TextRun[];
}

interface Author {
    name: string;
}

interface ViewCount {
    text: string;
}

interface PublishedTime {
    text: string;
}

interface LengthText {
    text: string;
}

interface VideoItem {
    type: string;
    title?: VideoTitle;
    video_id?: string;
    thumbnails?: Thumbnail[];
    author?: Author;
    short_view_count?: ViewCount;
    published?: PublishedTime;
    length_text?: LengthText;
}


export const searchPlaylists = async (query: string) => {
    const youtube = await Innertube.create();

    const search = await youtube.search(query, { type: 'playlist' });

    // Extract complete playlist information
    const playlists = search.results
        .filter((item: PlaylistItem) => item.type === 'LockupView')
        .map((item: PlaylistItem) => {
            // Get thumbnail (highest resolution available)
            const thumbnails = item.content_image?.primary_thumbnail?.image || [];
            // In your API route:
            const thumbnail = thumbnails.reduce((highest: Thumbnail | null, current: Thumbnail) =>
                (current.width > (highest?.width || 0)) ? current : highest, null
            )?.url.split('?')[0] || null;

            // Get creator from metadata rows
            let channelTitle = 'Unknown';
            const creatorRun = item.metadata?.metadata?.metadata_rows?.[0]?.metadata_parts?.[0]?.text?.runs?.[0];
            if (creatorRun && !creatorRun.text.includes('Playlist')) {
                channelTitle = creatorRun.text;
            }

            // Parse video count
            const countText = item.content_image?.primary_thumbnail?.overlays?.[0]?.badges?.[0]?.text || '0';
            const videoCount = parseInt(countText.replace(/\D/g, '')) || 0;

            return {
                type: "playlist",
                title: item.metadata?.title?.text || 'No title',
                playlistId: item.content_id || '',
                videoCount,
                thumbnail,
                channelTitle,
            } as PlaylistResultMap;
        })
        .filter(playlist => playlist.playlistId); // Remove invalid entries
    return playlists
}



export const searchVideos = async (query: string): Promise<VideoResultMap[]> => {
    const youtube = await Innertube.create();
    const search = await youtube.search(query, { type: 'video'});

    return search.results
        .filter((item: VideoItem) => item.type === 'Video')
        .map((item: VideoItem) => {
            // Get highest resolution thumbnail
            const thumbnails = item.thumbnails || [];
            const thumbnail = thumbnails.reduce((highest: Thumbnail | null, current: Thumbnail) =>
                (current.width > (highest?.width || 0)) ? current : highest, null
            )?.url.split('?')[0] || null; // Remove query params for Next.js Image
            
            return {
                videoId: item.video_id || '',
                title: item.title?.text || 'No title',
                date: item.published?.text || 'No date',
                thumbnail,
                channelTitle: item.author?.name || 'Unknown channel',
                duration: item.length_text?.text || '0:00',
                numberOfViews: item.short_view_count?.text || '0 views'
            } as VideoResultMap;
        })
        .filter(video => video.videoId); // Remove invalid entries
};