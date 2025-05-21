import { PlaylistMap, UserFavoritePlaylistMap } from "@/utils/types";

export function isValidYouTubeUrl(url: string): boolean {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|shorts\/)?([A-Za-z0-9_-]{11})(\S*)?$/;
    return regex.test(url);
}

export function extractVideoId(url: string): string {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : "";
}

export function isValidYouTubePlaylistUrl(url: string): boolean {
    if (/list=RD[MC]/.test(url)) return false;

    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(playlist|watch)\?(list=|.*&list=)([A-Za-z0-9_-]+)(&.*)?$/;
    return regex.test(url);
}

export function extractPlaylistId(url: string): string {
    if (/list=RD[MC]/.test(url)) return "";

    const regex = /(?:list=)([A-Za-z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : "";
}

export function extractVideoIdFromMixedUrl(url: string): string {
    const videoId = extractVideoId(url);
    if (videoId) return videoId;

    const videoRegex = /[?&]v=([A-Za-z0-9_-]{11})/;
    const videoMatch = url.match(videoRegex);
    return videoMatch ? videoMatch[1] : "";
}

export const getUpdatedPlaylist = (available: boolean, playlistId: string, favoritePlaylists: UserFavoritePlaylistMap[], playlist?: PlaylistMap,) => {
    const updatedPlaylists = favoritePlaylists.map(p =>
        p.playlistId === playlistId
            ? available && playlist
                ? {
                    playlistId: playlist.playlistId,
                    title: playlist.title,
                    isAvailable: true,
                    isYoutube: true,
                    thumbnail: playlist.videos[0]?.thumbnail,
                    videoCount: playlist.videos.length,
                }
                : { ...p, isAvailable: false }
            : p
    );
    return updatedPlaylists
};