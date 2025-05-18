"use client";
import React from "react";
import styles from "./UserSignInButton.module.css";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useOpenedBox } from "@/context/OpenedBoxContext";

export default function UserSignInButton() {
    const { photoURL, userName, loading, signOut } = useAuth();
    const { openedBoxId, setOpenedBoxId } = useOpenedBox();

    // Close dropdown when clicking outside

    if (loading) {
        return (
            <button disabled className={styles.signInButton}>
                <span className={styles.loadingDots}>...</span>
            </button>
        );
    }

    return photoURL && userName ? (
        <div
            className={styles.profileWrapper}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <button
                className={styles.profileButton}
                onClick={() => {
                    setOpenedBoxId(openedBoxId === "navBox" ? null : "navBox");
                }}
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
            {openedBoxId === "navBox" && (
                <div className={styles.dropDown}>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>{userName}</span>
                    </div>
                    <Link
                        className={styles.dropDownItem}
                        href="/playlists"
                        onClick={() => setOpenedBoxId(null)}
                    >
                        My Playlists
                    </Link>
                    <button
                        className={`${styles.dropDownItem} ${styles.logoutButton}`}
                        onClick={() => {
                            signOut();
                            setOpenedBoxId(null);
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
