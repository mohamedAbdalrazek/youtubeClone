import React from "react";
import styles from "./Footer.module.css";
import Link from "next/link";
import Image from "next/image";
export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerColumns}>
                    <div className={styles.footerColumn}>

                        <div className={styles.logoWrapper}>

                            <Image className={styles.logo} src={"/icon.png"} alt="Streamura" width={141} height={138} />
                            <h3 className={styles.logoText}>
                                Streamura
                            </h3>
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
                                <Link href="/terms">Terms of Service</Link>
                            </li>
                            <li>
                                <Link href="/privacy">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="/disclaimer">Disclaimer</Link>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.footerColumn}>
                        <h3 className={styles.footerHeading}>Connect</h3>
                        <div className={styles.socialLinks}>
                            <Link href="#" aria-label="Twitter">
                                Twitter
                            </Link>
                            <Link href="#" aria-label="GitHub">
                                GitHub
                            </Link>
                            <Link href="#" aria-label="Discord">
                                Discord
                            </Link>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>
                        &copy; 2025 Streamura. Not affiliated with YouTube or
                        Google.
                    </p>
                    <p className={styles.footerNote}>
                        This service complies with YouTube&apos;s Terms of
                        Service.
                    </p>
                </div>
            </div>
        </footer>
    );
}
