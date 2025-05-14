"use client";
import Link from "next/link";
import React from "react";
import styles from "./Nav.module.css";
import UserSignInButton from "../../sign-in/UserSignInButton";
import Image from "next/image";
import NavQuerySearch from "./NavQuerySearch";
import { useOpenedBox } from "@/context/OpenedBoxContext";
export default function Nav() {
    const { setOpenedBoxId } = useOpenedBox();

    return (
        <header className={styles.header} onClick={() => setOpenedBoxId(null)}>
            <div className={"container"}>
                <nav className={styles.nav}>
                    <Link href={"/"} className={styles.logoWrapper}>
                        <Image
                            src={"/side-logo.png"}
                            alt="Streamura"
                            width={412}
                            className={styles.logo}
                            height={73}
                        />
                    </Link>

                    <div className={styles.searchContainer}>
                        <NavQuerySearch />
                    </div>
                    <div className={styles.navRight}>
                        <div className={styles.navLinks}>
                            <Link href="/discover-playlists">
                                Discover Playlists
                            </Link>
                        </div>
                        <UserSignInButton />
                    </div>
                </nav>
            </div>
        </header>
    );
}
