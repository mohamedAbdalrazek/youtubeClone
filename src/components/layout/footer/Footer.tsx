import React from "react";
import styles from "./Footer.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.footerColumns}>
                    <div className={styles.footerColumn}>
                        <div className={styles.logoWrapper}>
                            <Image
                                className={styles.logo}
                                src={"/icon.png"}
                                alt="Streamura"
                                width={35}
                                height={35}
                            />
                            <h3 className={styles.logoText}>Streamura</h3>
                        </div>
                        <p className={styles.footerText}>
                            Watch YouTube videos without ads and create custom
                            playlists.
                        </p>
                    </div>

                    <div className={styles.footerColumn}>
                        <h3 className={styles.footerHeading}>Legal</h3>
                        <ul className={styles.footerLinks}>
                            <li>
                                <Link href="/privacy">Privacy Policy</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>
                        &copy; 2025 Streamura. Not affiliated with YouTube or
                        Google.
                    </p>
                    <p className={styles.footerNote}>
                        Built with ❤️ for seamless viewing.
                    </p>
                </div>
            </div>
        </footer>
    );
}
