"use client";
import React, {
    FormEvent,
    Suspense,
    useCallback,
    useState,
} from "react";
import styles from "./Search.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { extractVideoId, isValidYouTubeUrl } from "@/lib/searchFunctions";

function Search() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [query, setQuery] = useState<string | null>(null);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            params.delete("title");
            return params.toString();
        },
        [searchParams]
    );

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query) return;
        if (isValidYouTubeUrl(query)) {
            const url = extractVideoId(query);
            router.push(`/watch/${url}`);
        } else {
            router.push("/search/" + "?" + createQueryString("search", query));
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
