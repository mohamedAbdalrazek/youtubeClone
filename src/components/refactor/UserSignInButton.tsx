"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./UserSignInButton.module.css";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function UserSignInButton() {
    const { photoURL, userName, loading, signOut } = useAuth();
    const [showDropDown, setShowDropDown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowDropDown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading) {
        return (
            <button disabled className={styles.signInButton}>
                <span className={styles.loadingDots}>...</span>
            </button>
        );
    }

    return photoURL && userName ? (
        <div className={styles.profileWrapper} ref={dropdownRef}>
            <button
                className={styles.profileButton}
                onClick={() => setShowDropDown(!showDropDown)}
                aria-label="User menu"
            >
                <Image
                    className={styles.profilePicture}
                    src={photoURL}
                    alt={userName}
                    width={40}
                    height={40}
                    priority
                />
            </button>
            {showDropDown && (
                <div className={styles.dropDown}>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>{userName}</span>
                    </div>
                    <Link
                        className={styles.dropDownItem}
                        href="/playlists"
                        onClick={() => setShowDropDown(false)}
                    >
                        My Playlists
                    </Link>
                    <button
                        className={`${styles.dropDownItem} ${styles.logoutButton}`}
                        onClick={() => {
                            signOut();
                            setShowDropDown(false);
                        }}
                        disabled={loading}
                    >
                        {loading ? "Signing out..." : "Sign Out"}
                    </button>
                </div>
            )}
        </div>
    ) : (
        <Link href="/sign-in" className={styles.signInButton}>
            Sign In
        </Link>
    );
}
