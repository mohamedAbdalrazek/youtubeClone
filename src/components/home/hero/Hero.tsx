import React from "react";
import styles from "./Hero.module.css";
import QuerySearch from "./QuerySearch";
export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={"container"}>
                <h1 className={styles.heroTitle}>
                    Watch YouTube Videos, Playlists Without Ads
                </h1>
                <p className={styles.heroSubtitle}>
                    Enjoy your favorite YouTube content ad-free and save videos
                    to custom playlists for uninterrupted viewing.
                </p>

                <div className={styles.inputSection}>
                    <h3 className={styles.inputLabel}>Search Videos ,Playlists or type a Youtube URL</h3>
                    <QuerySearch />
                </div>
            </div>
        </section>
    );
}
