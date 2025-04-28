import React from "react";
import styles from "./Hero.module.css"
import UrlSearch from "./UrlSearch";
import QuerySearch from "./QuerySearch";
export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={"container"}>
                <h1 className={styles.heroTitle}>
                    Watch YouTube Videos Without Ads
                </h1>
                <p className={styles.heroSubtitle}>
                    Enjoy your favorite YouTube content ad-free and save videos
                    to custom playlists for uninterrupted viewing.
                </p>

                <div className={styles.inputSection}>
                    <h3 className={styles.inputLabel}>Enter YouTube URL</h3>
                    <UrlSearch />
                </div>

                <div className={styles.inputSection}>
                    <h3 className={styles.inputLabel}>Or Search Videos</h3>
                    <QuerySearch />
                </div>
            </div>
        </section>
    );
}
