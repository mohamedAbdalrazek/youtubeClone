import { useOpenedBox } from "@/context/OpenedBoxContext";
import TrashIcon from "@/icons/TrashIcon";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function DeleteYourPlaylist({
    className,
    playlistId,
}: {
    className?: string;
    playlistId: string;
}) {
    const [loading, setLoading] = useState(false);
    const uid = auth.currentUser?.uid;
    const router = useRouter()
    const {setOpenedBoxId} = useOpenedBox()
    const deletePlaylist = async () => {
        setLoading(true);
        const cookies = parseCookies();
        const authToken = cookies.token;
        try {
            const response = await fetch("/api/removePlaylist", {
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
                toast.dismiss();
                toast.success("Playlist was deleted!");
                setOpenedBoxId(null)
                router.push("/playlists");
            } else {
                console.error("Failed to add playlist:", data.message);
                toast.error("Something went wrong try again later");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error sending request to add playlist:", error);
            toast.error("Something went wrong try again later");
            setLoading(false);
        }
    };
    return (
        <button
            className={className}
            onClick={deletePlaylist}
            aria-label="Delete playlist"
            disabled={loading}
        >
            <span>Delete Playlist</span>
            <TrashIcon />
        </button>
    );
}
