"use client";
import React, { FormEvent, useState } from "react";
import styles from "./NavSearch.module.css"; // Shared style file
import { useRouter } from "next/navigation";
import {
    extractPlaylistId,
    extractVideoId,
    isValidYouTubePlaylistUrl,
    isValidYouTubeUrl,
} from "@/lib/searchFunctions";

export default function NavQuerySearch() {
    const router = useRouter();
    const [query, setQuery] = useState<null | string>(null);
    const params = new URLSearchParams();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query) return;
        if (isValidYouTubePlaylistUrl(query)) {
            const url = extractPlaylistId(query);
            params.set("youtube", "true");
            router.push(`/playlist/${url}/?${params.toString()}`);
        } else if (isValidYouTubeUrl(query)) {
            const url = extractVideoId(query);
            router.push(`/watch/${url}`);
        } else {
            params.set("search", query);
            params.set("type", "video");
            router.push(`/search/?${params.toString()}`);
        }
    };
    return (
        <form onSubmit={handleSubmit} className={`${styles.navSearchForm}`}>
            <input
                placeholder="Search videos, playlists or a URL..."
                type="text"
                onChange={(e) => setQuery(e.target.value)}
                className={styles.navSearchInput}
            />
            <button
                disabled={!query}
                className={styles.navSearchButton}
                aria-label="Search videos"
            >
                Search
            </button>
        </form>
    );
}
