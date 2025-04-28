"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import styles from "./Search.module.css";
import { useRouter } from "next/navigation";
export default function UrlSearch() {
    function isValidYouTubeUrl(url: string) {
        const regex =
            /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/)?[A-Za-z0-9_-]{11}(&.*)?$/;
        return regex.test(url);
    }
    function extractVideoId(url: string) {
        const regex = /(?:v=|\/)([0-9A-Za-z_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : "";
    }
    const router = useRouter();

    const [valid, setValid] = useState<null | boolean>(null);
    const [url, setUrl] = useState("");
    const handleChangeUrl = (e: ChangeEvent<HTMLInputElement>) => {
        if (isValidYouTubeUrl(e.target.value)) {
            setValid(true);
        } else {
            setValid(false);
        }
        setUrl(extractVideoId(e.target.value));
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
