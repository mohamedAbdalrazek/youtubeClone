import { UserFavoritePlaylistMap } from "@/utils/types";

export function checkSavedPlaylist(
    playlistId: string,
    favoritePlaylists: UserFavoritePlaylistMap[]
): boolean {
    return favoritePlaylists.some(p => p.playlistId === playlistId);
}
