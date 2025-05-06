"use client";
import React from "react";
import styles from "./Filter.module.css";
import { useRouter, useSearchParams } from "next/navigation";
export default function Filter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get("type");
    const handleFilter = (newType: string) => {
        if (type === newType) return;
        const params = new URLSearchParams(searchParams.toString());

        params.set("type", newType);

        router.push(`/search/?${params.toString()}`);
    };
    return (
        <div className={styles.searchFilters}>
            <div className={styles.filterOptions}>
                <button
                    className={`${styles.filterOption} ${
                        type !== "playlist" && styles.active
                    }`}
                    data-type="videos"
                    onClick={() => handleFilter("video")}
                >
                    <svg className={styles.filterIcon} viewBox="0 0 24 24">
                        <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    </svg>
                    Videos
                </button>
                <button
                    className={`${styles.filterOption} ${
                        type === "playlist" && styles.active
                    }`}
                    data-type="playlists"
                    onClick={() => handleFilter("playlist")}
                >
                    <svg className={styles.filterIcon} viewBox="0 0 24 24">
                        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" />
                    </svg>
                    Playlists
                </button>
            </div>
        </div>
    );
}
