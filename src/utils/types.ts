
export interface SearchResultMap {
    type: "playlist" | "video",
    playlistId?: string,
    videoId?: string;
    title: string;
    date: string;
    thumbnail: string;
    channelTitle: string;
};
export interface PlaylistVideoMap {
    videoId: string;
    thumbnail: string,
    channelTitle: string,
    title: string,
    date: string,
}
export interface WatchVideoMap {
    videoId: string,
    description: string,
    channelTitle: string,
    title: string,
    date: string,
    viewCount: number,
    thumbnail: string,
}
export interface UserPlaylistMap {
    playlistId: string;
    title: string
    visibility: "private" | "public"
    thumbnail:string;
    count:number
}
export interface NewPlaylistMap {
    userId: string; 
    userName: string;
    title: string;
    videos: Array<PlaylistVideoMap>;
    createdAt: string;
    isPublic: boolean;
}
export interface PlaylistMap{
    playlistId: string; 
    userName: string;
    title: string;
    videos: Array<PlaylistVideoMap>;
    isOwner:boolean;
    isFav:boolean;
    createdAt: string;
    isPublic: boolean;
}