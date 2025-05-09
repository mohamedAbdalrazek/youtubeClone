import AddPlaylistIcon from "@/icons/AddPlaylistIcon";
import { PlaylistVideoMap, VideoResultMap, WatchVideoMap } from "@/utils/types";
import React, { MouseEvent, useState } from "react";
import AddPlaylistPopup from "../AddPlaylistPopup";

export default function AddToPlaylistButton({
    video,
    className,
    isText=false,
}: {
    video: VideoResultMap | WatchVideoMap | PlaylistVideoMap;
    className?: string;
    isText?:boolean;
}) {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<null | PlaylistVideoMap>(
        null
    );

    const handleAddVideo = (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
        e.stopPropagation();
        e.preventDefault();
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
                    e.preventDefault();
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
