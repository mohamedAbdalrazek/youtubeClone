"use client";
import React, { FormEvent, useState } from "react";
import styles from "./NavSearch.module.css"; // Shared style file
import { useRouter } from "next/navigation";
import { extractVideoId, isValidYouTubeUrl } from "@/lib/searchFunctions";

export default function NavQuerySearch() {
    const router = useRouter();
    const [query, setQuery] = useState<null | string>(null);
    const params = new URLSearchParams();

    const handleClick = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query) return;

        if (isValidYouTubeUrl(query)) {
            const url = extractVideoId(query);
            router.push(`/watch/${url}`);
        } else {
            params.set("search", query);
            params.set("type", "video");
            router.push(`/search/?${params.toString()}`);
        }
    };
    return (
        <form onSubmit={handleClick} className={`${styles.navUrlForm}`}>
            <input
                placeholder="Search videos, playlists or type a URL..."
                type="text"
                onChange={(e) => setQuery(e.target.value)}
                className={styles.navInput}
            />
            <button
                disabled={!query}
                className={styles.navQueryButton}
                aria-label="Search videos"
            >
                Search
            </button>
        </form>
    );
}
