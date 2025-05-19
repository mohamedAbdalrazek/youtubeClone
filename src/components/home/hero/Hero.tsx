import React from "react";
import styles from "./Hero.module.css";
import QuerySearch from "./QuerySearch";

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className="container">
                <h1 className={styles.heroTitle}>YouTube, Without the Noise</h1>
                <p className={styles.heroSubtitle}>
                    Say goodbye to ads, clutter, and distractions. Watch YouTube
                    videos and playlists in a cleaner, faster experience —
                    totally ad-free. Save your favorites, build custom
                    playlists, and access your content anywhere.
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
