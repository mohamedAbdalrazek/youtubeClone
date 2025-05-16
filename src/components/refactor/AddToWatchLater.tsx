import WatchLaterIcon from "@/icons/WatchLaterIcon";
import { auth } from "@/utils/firebase";
import { PlaylistVideoMap, VideoResultMap, WatchVideoMap } from "@/utils/types";
import { parseCookies } from "nookies";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function AddToWatchLater({
    className,
    isText,
    video,
}: {
    className: string;
    video: VideoResultMap | WatchVideoMap | PlaylistVideoMap;
    isText: boolean;
}) {
    const [loading, setLoading] = useState(false);
    const uid = auth.currentUser?.uid;
    const userName = auth.currentUser?.displayName;

    const addVideo = async () => {
        setLoading(true);
        const formedData = {
            videoId: video.videoId,
            thumbnail: video.thumbnail,
            channelTitle: video.channelTitle,
            title: video.title,
        };
        const cookies = parseCookies();
        const authToken = cookies.token;
        try {
            const response = await fetch("/api/watchLater", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`, // If you implemented token-based authentication
                },
                body: JSON.stringify({
                    uid,
                    userName,
                    video: formedData,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.dismiss();
                toast.success("Video added to the watch later!");
            } else {
                console.error("Failed to add video:", data.message);
                toast.error("Something went wrong try again later");
            }
        } catch (error) {
            console.error("Error sending request to add playlist:", error);
            toast.error("Something went wrong try again later");
        } finally {
            setLoading(false);
        }
    };
    return (
        <button
            className={className}
            onClick={addVideo}
            aria-label="Add to watch later"
            disabled={loading}
        >
            <WatchLaterIcon />
            {isText && <span>Watch later</span>}
        </button>
    );
}
