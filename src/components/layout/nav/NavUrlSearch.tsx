"use client";
import React, {
    ChangeEvent,
    Dispatch,
    FormEvent,
    useState,
} from "react";
import styles from "./NavSearch.module.css"; // New style file
import { useRouter } from "next/navigation";
// import { extractVideoId, isValidYouTubeUrl } from "@/lib/searchFunctions";

export default function NavUrlSearch({
    openedInput,
    setOpenedInput,
}: {
    openedInput: null | "search" | "watch";
    setOpenedInput: Dispatch<React.SetStateAction<"search" | "watch" | null>>;
}) {
    const router = useRouter();
    // const [valid, setValid] = useState<null | boolean>(null);
    const [url, setUrl] = useState("");
    const params = new URLSearchParams();

    const handleChangeUrl = (e: ChangeEvent<HTMLInputElement>) => {
        // const isValid = isValidYouTubeUrl(e.target.value);
        // setValid(isValid);
        // setUrl(isValid ? extractVideoId(e.target.value) : "");
        setUrl(e.target.value);
    };
    const handleClick = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (openedInput === "watch") {
            if (url) {
                // router.push(`/watch/${url}`);
                params.set("search", url);
                params.set("type", "playlist");
                router.push(`/search/?${params.toString()}`);
            }
        } else {
            setOpenedInput("watch");
        }
    };
    return (
        <form
            onSubmit={handleClick}
            className={`${styles.navUrlForm} ${
                openedInput === "watch" ? styles.opened : styles.closed
            }`}
        >
            <input
                placeholder="Paste YouTube URL"
                type="text"
                onChange={handleChangeUrl}
                className={styles.navInput}
            />
            <button
                className={styles.navUrlButton}
                aria-label="Watch video"
                // disabled={!valid && openedInput === "watch"}
            >
                Watch
            </button>
        </form>
    );
}
