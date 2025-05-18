import FilledFavoriteIcon from "@/icons/FilledFavoriteIcon";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import React, { Dispatch, useState } from "react";
import toast from "react-hot-toast";

export default function RemovePlaylist({
    playlistId,
    className,
    isText,
    setIsFavorite,
}: {
    playlistId: string;
    className?: string;
    isText?: boolean;
    setIsFavorite?: Dispatch<React.SetStateAction<boolean>>;
}) {
    const [loading, setLoading] = useState(false);
    const uid = auth.currentUser?.uid;
    const router = useRouter()

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
                    playlistId,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Playlist removed successfully!");
                if (setIsFavorite) {
                    setIsFavorite(false);
                } else {
                    router.push("/playlists")
                }
            } else {
                console.error("Failed to remove playlist:", data.message);
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.error("Error sending request to remove playlist:", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    return (
        <button
            className={className}
            onClick={handleDeleteFav}
            disabled={loading}
        >
            {isText && <span>Remove playlist</span>}
            <FilledFavoriteIcon />
        </button>
    );
}
