"use client";
import React, { Dispatch, FormEvent,useState } from "react";
import styles from "./NavSearch.module.css"; // Shared style file
import { useRouter } from "next/navigation";

export default function NavQuerySearch({
    openedInput,
    setOpenedInput,
}: {
    openedInput: null | "search" | "watch";
    setOpenedInput: Dispatch<React.SetStateAction<"search" | "watch" | null>>;
}) {
    const router = useRouter();
    const [query, setQuery] = useState<null | string>(null);
    // const searchParams = useSearchParams();
    const params = new URLSearchParams();
    // const createQueryString = useCallback(
    //     (name: string, value: string) => {
    //         const params = new URLSearchParams(searchParams.toString());
    //         params.set(name, value);
    //         params.delete("title");
    //         return params.toString();
    //     },
    //     [searchParams]
    // );
    const handleClick = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (openedInput === "search") {
            if (query) {
                console.log(query);
                params.set("search", query);
                params.set("type", "video");
                router.push(`/search/?${params.toString()}`);
            }
        } else {
            setOpenedInput("search");
        }
    };
    return (
        <form
            onSubmit={handleClick}
            className={`${styles.navUrlForm} ${
                openedInput === "search" ? styles.opened : styles.closed
            }`}
        >
            <input
                placeholder="Search videos..."
                type="text"
                onChange={(e) => setQuery(e.target.value)}
                className={styles.navInput}
            />
            <button
                disabled={!query && openedInput === "search"}
                className={styles.navQueryButton}
                aria-label="Search videos"
            >
                Search
            </button>
        </form>
    );
}
