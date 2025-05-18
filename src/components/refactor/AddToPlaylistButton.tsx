import AddPlaylistIcon from "@/icons/AddPlaylistIcon";
import { PlaylistVideoMap, VideoResultMap, WatchVideoMap } from "@/utils/types";
import React, { MouseEvent, useState } from "react";
import AddPlaylistPopup from "../AddPlaylistPopup";
import { auth } from "@/utils/firebase";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function AddToPlaylistButton({
    video,
    className,
    isText = false,
}: {
    video: VideoResultMap | WatchVideoMap | PlaylistVideoMap;
    className?: string;
    isText?: boolean;
}) {
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();
    const [selectedVideo, setSelectedVideo] = useState<null | PlaylistVideoMap>(
        null
    );
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const handleAddVideo = (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
        e.stopPropagation();
        e.preventDefault();
        if (!auth.currentUser) {
            const query = searchParams.toString();
            const fullPath = `${pathname}${query ? `?${query}` : ""}`;
            router.push(`/sign-in?redirect=${encodeURIComponent(fullPath)}`);
            return;
        }
        if (!video.videoId || !video.thumbnail) {
            return;
        }
        setShowPopup(true);
        const formedData = {
            videoId: video.videoId,
            thumbnail: video.thumbnail,
            channelTitle: video.channelTitle,
            title: video.title,
        };
        setSelectedVideo(formedData);
    };
    return (
        <>
            {showPopup && (
                <AddPlaylistPopup
                    video={selectedVideo}
                    setShowPopup={setShowPopup}
                />
            )}
            <button
                className={className}
                onClick={(e) => {
                    handleAddVideo(e);
                }}
                aria-label="Add to playlist"
            >
                <AddPlaylistIcon />
                {isText && <span>Add to Playlist</span>}
            </button>
        </>
    );
}
