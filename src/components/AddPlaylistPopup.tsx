import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { auth } from "@/utils/firebase"; // your firebase init
import styles from "@/css/AddPlaylistPopup.module.css";
import NewPlaylistForm from "./NewPlaylistForm";
import GlobeIcon from "@/icons/GlobeIcon";
import LockIcon from "@/icons/LockIcon";
import {PlaylistVideoMap, UserPlaylistMap } from "@/utils/types";
import { parseCookies } from "nookies";
import toast from "react-hot-toast";

export default function AddPlaylistPopup({
    setShowPopup,
    video,
}: {
    setShowPopup: Dispatch<SetStateAction<boolean>>;
    video: PlaylistVideoMap | null;
}) {
    const uid = auth.currentUser?.uid;
    const [playlists, setPlaylists] = useState<null | UserPlaylistMap[]>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [errorMessage, setErrorMessage] = useState<null | string>();
    const [sending, setSending] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState<null | string>(
        null
    );
    useEffect(() => {
        if (showAdd === true) return;
        setLoading(true);
        const fetchUserData = async () => {
            try {
                if (!uid) {
                    throw new Error("No UID found in cookies.");
                }
                const cookies = parseCookies();
                const authToken = cookies.token;
                const res = await fetch(`/api/getPlaylists?uid=${uid}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                const data = await res.json();
                if (!res.ok)
                    throw new Error(
                        data.message || "Failed to fetch play  ls."
                    );

                setPlaylists(data.playlists);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
                setError("An error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [uid, showAdd]);
    const addVideo = async () => {
        if (!selectedPlaylist) {
            setErrorMessage("Please fill in all fields.");
            return;
        }
        setSending(true);

        const cookies = parseCookies();
        const authToken = cookies.token;
        try {
            const response = await fetch("/api/addVideoToPlaylist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`, // If you implemented token-based authentication
                },
                body: JSON.stringify({
                    uid,
                    playlistId: selectedPlaylist,
                    video,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Video added successfully:", data.message);
                toast.dismiss();
                toast.success("Video added to the playlist successfully!");
                setShowPopup(false);
            } else {
                console.error("Failed to add video:", data.message);
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error("Error sending request to add playlist:", error);
            setErrorMessage("Failed to send request to the server.");
        } finally {
            setSending(false);
        }
    };
    return (
        <div className={styles.popup} onClick={() => setShowPopup(false)}>
            <div className={styles.box} onClick={(e) => e.stopPropagation()}>
                <span
                    onClick={() => setShowPopup(false)}
                    className={styles.close}
                >
                    X
                </span>
                {error ? (
                    <p>{error}</p>
                ) : loading ? (
                    <div>Loading...</div>
                ) : showAdd ? (
                    <NewPlaylistForm uid={uid} setShowAdd={setShowAdd} />
                ) : (
                    <div>
                        {playlists && playlists.length ? (
                            <div>
                                <h3 className={styles.header}>
                                    Choose a playlist
                                </h3>
                                <ul className={styles.playlistsWrapper}>
                                    {playlists.map((playlist) => (
                                        <li
                                            key={playlist.playlistId}
                                            className={styles.playlist}
                                        >
                                            <label
                                                htmlFor={playlist.playlistId}
                                                className={styles.label}
                                            >
                                                {playlist.visibility ===
                                                "public" ? (
                                                    <GlobeIcon
                                                        className={styles.icon}
                                                    />
                                                ) : (
                                                    <LockIcon
                                                        className={styles.icon}
                                                    />
                                                )}
                                                <span
                                                    className={
                                                        styles.playlistTitle
                                                    }
                                                >
                                                    {playlist.title}
                                                </span>
                                            </label>
                                            <input
                                                className={styles.radio}
                                                type="radio"
                                                name="playlist"
                                                value={playlist.playlistId}
                                                id={playlist.playlistId}
                                                disabled={sending}
                                                checked={
                                                    selectedPlaylist ===
                                                    playlist.playlistId
                                                }
                                                onChange={() =>
                                                    setSelectedPlaylist(
                                                        playlist.playlistId
                                                    )
                                                }
                                            />
                                        </li>
                                    ))}
                                </ul>

                                {errorMessage && <p>{errorMessage}</p>}
                                <button
                                    disabled={
                                        selectedPlaylist === null || sending
                                    }
                                    className={styles.addButton}
                                    onClick={addVideo}
                                >
                                    Add video
                                </button>
                            </div>
                        ) : (
                            <p className={styles.emptyMessage}>
                                You have no playlists
                            </p>
                        )}

                        <button
                            className={styles.newButton}
                            onClick={() => setShowAdd(true)}
                            disabled={sending}
                        >
                            <span className={styles.plus}>+</span> New playlist
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
