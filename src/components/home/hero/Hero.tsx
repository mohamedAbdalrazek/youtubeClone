import React from "react";
import styles from "./Hero.module.css";
import QuerySearch from "./QuerySearch";

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className="container">
                <h1 className={styles.heroTitle}>
                    Ad-free Youtube
                </h1>
                <p className={styles.heroSubtitle}>
                    Search and watch YouTube videos and playlists ad-free.
                    Organize, customize, and manage your favorites like never
                    before.
                </p>

                <div className={styles.inputSection}>
                    <h3 className={styles.inputLabel}>
                        Search for videos, playlists, or paste any YouTube link
                    </h3>
                    <QuerySearch />
                </div>
            </div>
        </section>
    );
}
