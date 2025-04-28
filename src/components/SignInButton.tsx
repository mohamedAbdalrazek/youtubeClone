"use client";
import React, { useState } from "react";
import styles from "@/css/SignInButton.module.css";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
export default function SignInButton() {
    const { photoURL, userName, loading, signOut } = useAuth();
    const [showDropDown, setShowDropDown] = useState(false);
    if (loading)
        return (
            <button disabled className={styles.signInButton}>
                Loading...
            </button>
        );

    return photoURL && userName ? (
        <div className={styles.profileWrapper}>
            <Image
                className={styles.profilePicture}
                src={photoURL}
                alt={userName}
                width={96}
                height={96}
                onClick={() => setShowDropDown(!showDropDown)}
            />
            {showDropDown && (
                <div className={styles.dropDown}>
                    <Link className={styles.dropDownItem} href={"/playlists"}>
                        Playlists
                    </Link>

                    <button
                        className={styles.dropDownItem}
                        onClick={() => signOut()}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Log out"}
                    </button>
                </div>
            )}
        </div>
    ) : (
        <Link href={"/sign-in"} className={styles.signInButton}>
            Sign In
        </Link>
    );
}
