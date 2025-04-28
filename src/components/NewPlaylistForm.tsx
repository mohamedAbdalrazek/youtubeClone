import React, { Dispatch, SetStateAction, useState } from "react";
import DOMPurify from "dompurify";
import { parseCookies } from "nookies";
import styles from "@/css/NewPlaylistForm.module.css";
import toast from "react-hot-toast";
export default function NewPlaylistForm({
    uid,
    setShowAdd,
}: {
    uid?: string;
    setShowAdd: Dispatch<SetStateAction<boolean>>;
}) {
    const [newPlaylist, setNewPlaylist] = useState({
        title: "",
        visibility: "public",
        playlistId: crypto.randomUUID(),
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setNewPlaylist((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        const { title, visibility } = newPlaylist;
        const sanitizedTitle = DOMPurify.sanitize(title.trim());

        if (!sanitizedTitle || !visibility) {
            setErrorMessage("Please fill in all fields.");
            return;
        }
        setLoading(true);
        const cookies = parseCookies();
        const authToken = cookies.token;
        const userName = cookies.userName;
        try {
            const response = await fetch("/api/addNewPlaylist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`, // If you implemented token-based authentication
                },
                body: JSON.stringify({
                    uid,
                    userName,
                    newPlaylist: newPlaylist,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Playlist added successfully:", data.message);
                toast.success("Playlist added successfully!");

                setShowAdd(false);
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
    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className={styles.header}>Add New Playlist</h3>
            <input
                type="text"
                placeholder="Title..."
                required
                name="title"
                className={styles.input}
                value={newPlaylist.title}
                onChange={handleChange}
                disabled={loading}
            />
            <select
                name="visibility"
                value={newPlaylist.visibility}
                onChange={handleChange}
                disabled={loading}
                className={styles.select}
            >
                <option value="public">Public</option>
                <option value="private">Private</option>
            </select>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <div className={styles.buttonsWrapper}>
                <button
                    className={styles.button}
                    type="button"
                    disabled={loading}
                    onClick={() => setShowAdd(false)}
                >
                    {loading ? "Creating..." : "Cancel"}
                </button>
                <button
                    type="submit"
                    className={styles.button}
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Playlist"}
                </button>
            </div>
        </form>
    );
}
