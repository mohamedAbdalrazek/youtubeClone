import Link from "next/link";
import React from "react";
import styles from "./Nav.module.css";
import UserSignInButton from "./UserSignInButton";
import Image from "next/image";
export default function Nav() {
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
