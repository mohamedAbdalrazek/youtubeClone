import { PlaylistMap, PlaylistResultMap, PlaylistVideoMap, VideoResultMap } from '@/utils/types';
import { Client, Playlist } from 'youtubei';
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
    const search = await youtube.search(query, { type: 'video' });

    return search.results
        .filter((item: VideoItem) => item.type === 'Video')
        .map((item: VideoItem) => {
            // Get highest resolution thumbnail
            const thumbnails = item.thumbnails || [];
            // const thumbnail = thumbnails.reduce((highest: Thumbnail | null, current: Thumbnail) =>
            //     (current.width > (highest?.width || 0)) ? current : highest, null
            // )?.url.split('?')[0] || null; // Remove query params for Next.js Image

            return {
                videoId: item.video_id || '',
                title: item.title?.text || 'No title',
                date: item.published?.text || 'No date',
                thumbnail:thumbnails[0].url||null,
                channelTitle: item.author?.name || 'Unknown channel',
                duration: item.length_text?.text || '0:00',
                numberOfViews: item.short_view_count?.text || '0 views'
            } as VideoResultMap;
        })
        .filter(video => video.videoId); // Remove invalid entries
};


export interface WatchVideoMap {
    videoId: string;
    description: string;
    channelTitle: string;
    title: string;
    date: string;
    viewCount: number;
    thumbnail: string;
}

export async function getVideoDetails(videoId: string): Promise<WatchVideoMap | null> {
    try {
        console.log({videoId})
        const youtube = new Client();
        const video = await youtube.getVideo(videoId);
        console.log({video})
        if (!video) {
            return null;
        }

        return {
            videoId: video.id,
            title: video.title,
            description: video.description,
            channelTitle: video.channel?.name || "Unknown Channel",
            date: video.uploadDate || "",
            viewCount: video.viewCount || 0,
            thumbnail: video.thumbnails.best || "",
        } as WatchVideoMap;
    } catch (error) {
        console.error("Error fetching video details:", error);
        return null;
    }
}

export async function getYoutubePlaylist(playlistId: string): Promise<PlaylistMap | null> {
    const youtube = new Client();
    const dataPlaylist = await youtube.getPlaylist(playlistId) as Playlist;
    if (!dataPlaylist) return null;

    const videos: PlaylistVideoMap[] = [];
    const seenVideoIds = new Set<string>(); // Track unique IDs

    // Process initial batch
    for (const video of dataPlaylist.videos.items) {
        if (videos.length >= 1000) break;
        if (seenVideoIds.has(video.id)) continue; // Skip duplicates

        try {
            seenVideoIds.add(video.id);
            videos.push({
                videoId: video.id,
                title: video.title,
                channelTitle: video.channel?.name || "Unknown Channel",
                thumbnail: `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
            });
        } catch (error) {
            console.warn(`Skipping video ${video.id}:`, error);
        }
    }

    // Process continuations
    while (
        dataPlaylist.videos.continuation &&
        videos.length < 1000 &&
        videos.length < dataPlaylist.videoCount
    ) {
        try {
            // Clear previous items before loading next batch
            dataPlaylist.videos.items = [];
            
            await dataPlaylist.videos.next();
            
            for (const video of dataPlaylist.videos.items) {
                if (videos.length >= 1000) break;
                if (seenVideoIds.has(video.id)) continue;

                seenVideoIds.add(video.id);
                videos.push({
                    videoId: video.id,
                    title: video.title,
                    channelTitle: video.channel?.name || "Unknown Channel",
                    thumbnail: `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
                });
            }
        } catch (error) {
            console.error("Continuation error:", error);
            break;
        }
    }

    return {
        playlistId: dataPlaylist.id,
        title: dataPlaylist.title,
        creator: dataPlaylist.channel?.name || "Unknown Creator",
        videos,
        createdAt: dataPlaylist.lastUpdatedAt || "",
        isPublic: true,
        isOwner: false,
    };
}