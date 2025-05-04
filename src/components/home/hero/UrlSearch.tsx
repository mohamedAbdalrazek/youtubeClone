"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import styles from "./Search.module.css";
import { useRouter } from "next/navigation";
import { extractVideoId, isValidYouTubeUrl } from "@/lib/searchFunctions";
export default function UrlSearch() {
    const router = useRouter();

    const [valid, setValid] = useState<null | boolean>(null);
    const [url, setUrl] = useState("");
    const handleChangeUrl = (e: ChangeEvent<HTMLInputElement>) => {
        if (isValidYouTubeUrl(e.target.value)) {
            setValid(true);
            setUrl(extractVideoId(e.target.value));
        } else {
            setValid(false);
        }
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (url) {
            router.push(`/watch/${url}`);
        }
    };
    return (
        <form onSubmit={handleSubmit} className={styles.searchInput}>
            <input
                placeholder="Paste YouTube URL here (e.g. https://www.youtube.com/watch?v=...)"
                type="text"
                onChange={handleChangeUrl}
                className={`${styles.inputField}`}
            />
            <button
                disabled={!valid}
                className={`${styles.submitButton} ${
                    !valid && styles.notValidLink
                }`}
            >
                Watch Now
            </button>
        </form>
    );
}
