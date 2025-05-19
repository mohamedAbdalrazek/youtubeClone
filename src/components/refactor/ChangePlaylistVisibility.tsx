import { useOpenedBox } from "@/context/OpenedBoxContext";
import GlobeIcon from "@/icons/GlobeIcon";
import LockIcon from "@/icons/LockIcon";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function ChangePlaylistVisibility({
    className,
    playlistId,
    visibility,
}: {
    className?: string;
    playlistId: string;
    visibility: "public" | "private";
}) {
    const [loading, setLoading] = useState(false);
    const uid = auth.currentUser?.uid;
    const router = useRouter();
    const {setOpenedBoxId} = useOpenedBox()
    const changePlaylistVisibility = async () => {
        setLoading(true);
        const cookies = parseCookies();
        const authToken = cookies.token;
        try {
            const response = await fetch("/api/changePlaylistVisibility", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`, // If you implemented token-based authentication
                },
                body: JSON.stringify({
                    uid,
                    playlistId,
                    visibility,
                }),
            });

            const data = await response.json();

            if (response.ok) {
            
                toast.dismiss();
                toast.success(`Playlist is ${visibility}`);
                setOpenedBoxId(null)
                router.push("/playlists");
            } else {
                console.error(
                    `Failed to make the playlist ${visibility}:`,
                    data.message
                );
                toast.error("Something went wrong try again later");
                setLoading(false);
            }
        } catch (error) {
            console.error(
                `Error sending request to change playlist ${visibility}:`,
                error
            );
            toast.error("Something went wrong try again later");
            setLoading(false);
        }
    };
    return (
        <button
            className={className}
            onClick={changePlaylistVisibility}
            aria-label="change playlist visibility"
            disabled={loading}
        >
            <span>{`Make it ${visibility}`}</span>
            {visibility === "public" ? <GlobeIcon /> : <LockIcon />}
        </button>
    );
}
