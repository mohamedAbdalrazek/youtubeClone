import EmptyFavoriteIcon from "@/icons/EmptyFavoriteIcon";
import FilledFavoriteIcon from "@/icons/FilledFavoriteIcon";
import { auth } from "@/utils/firebase";
import { UserFavoritePlaylistMap } from "@/utils/types";
import { parseCookies } from "nookies";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function SavePlaylist({
    playlist,
    className,
    isText = true,
}: {
    playlist: UserFavoritePlaylistMap;
    className?: string;
    isText?: boolean;
}) {
    const uid = auth.currentUser?.uid;
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isFav, setIsFav] = useState(false);
    const handleAddFav = async () => {
        setLoading(true);
        const cookies = parseCookies();
        const authToken = cookies.token;
        try {
            const response = await fetch("/api/addFavoritePlaylist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`, // If you implemented token-based authentication
                },
                body: JSON.stringify({
                    uid,
                    newPlaylist: playlist,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Playlist added successfully:", data.message);
                toast.success("Playlist added successfully!");
                setIsFav(true);
            } else {
                console.error("Failed to add playlist:", data.message);
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error("Error sending request to add playlist:", error);

            setErrorMessage("Failed to send request to the server.");
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteFav = async () => {
        setLoading(true);
        const cookies = parseCookies();
        const authToken = cookies.token;
        try {
            const response = await fetch("/api/removeFavoritePlaylist", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`, // If you implemented token-based authentication
                },
                body: JSON.stringify({
                    uid,
                    playlistId: playlist.playlistId,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Playlist added successfully:", data.message);
                toast.success("Playlist removec successfully!");
                setIsFav(false);
            } else {
                console.error("Failed to remove playlist:", data.message);
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error("Error sending request to remove playlist:", error);

            setErrorMessage("Failed to send request to the server.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={className}>
            {!isFav ? (
                <button onClick={handleAddFav} disabled={loading}>
                    {isText && <span>Save playlist</span>}
                    <EmptyFavoriteIcon />
                </button>
            ) : (
                <button onClick={handleDeleteFav} disabled={loading}>
                    <FilledFavoriteIcon />
                </button>
            )}
            {errorMessage && <div>{errorMessage}</div>}
        </div>
    );
}
