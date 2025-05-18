import React from "react";
import styles from "./Features.module.css";
import AddFreeIcon from "@/icons/AddFreeIcon";
import PlaylistMusicIcon from "@/icons/PlaylistMusicIcon";
import RocketIcon from "@/icons/RocketIcon";

export default function Features() {
    return (
        <section className={styles.features}>
            <div className="container">
                <h2 className={styles.featuresTitle}>Why Choose Streamura?</h2>

                <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                        <AddFreeIcon className={styles.featureIcon} />
                        <h3 className={styles.featureTitle}>Ad-Free Viewing</h3>
                        <p className={styles.featureText}>
                            Watch any YouTube video or playlist without
                            interruptions from ads — smooth and
                            distraction-free.
                        </p>
                    </div>

                    <div className={styles.featureCard}>
                        <PlaylistMusicIcon className={styles.featureIcon} />
                        <h3 className={styles.featureTitle}>
                            Save & Organize Playlists
                        </h3>
                        <p className={styles.featureText}>
                            Save any YouTube playlist to your Streamura account,
                            manage your own playlists, and build a personalized
                            watch-later list — all in one place.
                        </p>
                    </div>

                    <div className={styles.featureCard}>
                        <RocketIcon className={styles.featureIcon} />
                        <h3 className={styles.featureTitle}>
                            Personalized Experience
                        </h3>
                        <p className={styles.featureText}>
                            Sign in to unlock features like saving favorites,
                            customizing playlists, and syncing across devices.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
