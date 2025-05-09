"use client";
import React, { FormEvent, Suspense, useState } from "react";
import styles from "./Search.module.css";
import { useRouter } from "next/navigation";
import { extractPlaylistId, extractVideoId, isValidYouTubePlaylistUrl, isValidYouTubeUrl } from "@/lib/searchFunctions";

function Search() {
    const router = useRouter();
    const [query, setQuery] = useState<string | null>(null);
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
        <form className={styles.urlInput} onSubmit={handleSubmit}>
            <input
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Videos, Playlists or Youtube URL..."
                type="text"
                className={`${styles.inputField}`}
            />
            <button
                className={`${styles.submitButton} ${
                    (query === null || query) && styles.notValidLink
                }`}
                disabled={query === null ? true : false}
            >
                Search
            </button>
        </form>
    );
}
export default function QuerySearch() {
    return (
        <Suspense>
            <Search />
        </Suspense>
    );
}
