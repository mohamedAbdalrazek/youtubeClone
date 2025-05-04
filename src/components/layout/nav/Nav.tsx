"use client";
import Link from "next/link";
import React, { useState } from "react";
import styles from "./Nav.module.css";
import UserSignInButton from "../../sign-in/UserSignInButton";
import Image from "next/image";
import NavUrlSearch from "./NavUrlSearch";
import NavQuerySearch from "./NavQuerySearch";
export default function Nav() {
    const [openedInput, setOpenedInput] = useState<null | "search" | "watch">(
        "search"
    );
    return (
        <header className={styles.header}>
            <div className={"container"}>
                <nav className={styles.nav}>
                    <Image
                        src={"/side-logo.png"}
                        alt="Streamura"
                        width={412}
                        className={styles.logo}
                        height={73}
                    />

                    <div className={styles.navRight}>
                        <div className={styles.searchContainer}>
                            <NavUrlSearch
                                openedInput={openedInput}
                                setOpenedInput={setOpenedInput}
                            />
                            <NavQuerySearch
                                openedInput={openedInput}
                                setOpenedInput={setOpenedInput}
                            />
                        </div>
                        <div className={styles.navLinks}>
                            <Link href="/">Home</Link>
                            <Link href="/playlists">My Playlists</Link>
                            <Link href="#">How It Works</Link>
                            <Link href="#">About</Link>
                        </div>
                        <UserSignInButton />
                    </div>
                </nav>
            </div>
        </header>
    );
}
