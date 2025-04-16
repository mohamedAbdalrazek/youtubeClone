"use client";
import React, {
    ChangeEvent,
    FormEvent,
    Suspense,
    useCallback,
    useState,
} from "react";
import styles from "@/css/Search.module.css";
import { useRouter, useSearchParams } from "next/navigation";

function Search() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            params.delete("title");
            return params.toString();
        },
        [searchParams]
    );

    const [empty, setEmpty] = useState<null | boolean>(null);
    const [query, setQuery] = useState<string>("");
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) {
            setEmpty(true);
        } else {
            setEmpty(false);
        }
        setQuery(e.target.value);
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push("/" + "?" + createQueryString("search", query));
    };
    return (
        <form className={styles.urlSearch} onSubmit={handleSubmit}>
            <label className={styles.inputWrapper}>
                <input
                    onChange={handleChange}
                    placeholder="e.g., الفقرة الصباحية الجميلة"
                    type="text"
                    className={`${styles.input} ${
                        empty === true && styles.notValid
                    }`}
                />
                <button
                    className={`${styles.inputButton} ${
                        (empty === null || empty) && styles.notValidLink
                    }`}
                    disabled={empty === null ? false : empty}
                >
                    Search
                </button>
            </label>
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
