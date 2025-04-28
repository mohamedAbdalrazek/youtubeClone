export interface Playlist {
    playlistId: string;
    title: string;
    visibility: "private" | "public";
}
export interface Video {
    videoId: string;
    title: string;
    date: string;
    url: string;
    height: number;
    width: number;
    channelTitle: string;
};
export interface PlaylistDocument {
    id?: string; // Firestore document ID
    userId: string; // Firebase Auth ID of the owner
    userName: string;
    title: string;
    videos: Array<Video>;
    createdAt: string;
    isPublic: boolean;
}