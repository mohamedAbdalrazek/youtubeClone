import EmptyFavoriteIcon from "@/icons/EmptyFavoriteIcon";
import { auth } from "@/utils/firebase";
import { UserFavoritePlaylistMap } from "@/utils/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseCookies } from "nookies";
import React, { Dispatch, useState } from "react";
import toast from "react-hot-toast";

export default function SavePlaylist({
    playlist,
    className,
    isText = false,
    setIsFavorite,
}: {
    playlist: UserFavoritePlaylistMap;
    className?: string;
    isText?: boolean;
    setIsFavorite: Dispatch<React.SetStateAction<boolean>>;
}) {
    const uid = auth.currentUser?.uid;
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const pathname = usePathname();
        const searchParams = useSearchParams();
    const handleAddFav = async () => {
        if (!auth.currentUser) {
            const query = searchParams.toString();
            const fullPath = `${pathname}${query ? `?${query}` : ""}`;
            router.push(`/sign-in?redirect=${encodeURIComponent(fullPath)}`);
            return;
        }
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
                toast.success("Playlist added successfully!");
                setIsFavorite(true);
            } else {
                console.error("Failed to add playlist:", data.message);
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.error("Error sending request to add playlist:", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleAddFav} disabled={loading} className={className}>
            {isText && <span>Save playlist</span>}
            <EmptyFavoriteIcon />
        </button>
    );
}
