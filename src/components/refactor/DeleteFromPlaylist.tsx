import TrashIcon from "@/icons/TrashIcon";
import { auth } from "@/utils/firebase";
import { parseCookies } from "nookies";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function AddToWatchLater({
    className,
    isText,
    videoId,
    playlistId,
}: {
    className?: string;
    isText: boolean;
    videoId: string;
    playlistId: string;
}) {
    const [loading, setLoading] = useState(false);
    const uid = auth.currentUser?.uid;
    const addVideo = async () => {
        setLoading(true);
        const cookies = parseCookies();
        const authToken = cookies.token;
        try {
            const response = await fetch("/api/deleteVideoFromPlaylist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`, // If you implemented token-based authentication
                },
                body: JSON.stringify({
                    uid,
                    videoId,
                    playlistId,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Video deleted successfully:", data.message);
                toast.dismiss();
                toast.success("Video deleted from playlist!");
                window.location.reload();
            } else {
                console.error("Failed to add video:", data.message);
                toast.error("Somthing went wrong try again later");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error sending request to add playlist:", error);
            toast.error("Somthing wen wrong try again later");
            setLoading(false);
        }
    };
    return (
        <button
            className={className}
            onClick={addVideo}
            aria-label="Delete video from playlist"
            disabled={loading}
        >
            <TrashIcon />
            {isText && <span>Delete video</span>}
        </button>
    );
}
