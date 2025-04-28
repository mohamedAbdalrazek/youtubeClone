import React from "react";
import styles from "./Features.module.css";
import AddFreeIcon from "@/icons/AddFreeIcon";
import PlaylistMusicIcon from "@/icons/PlaylistMusicIcon";
import RocketIcon from "@/icons/RocketIcon";
export default function Features() {
    return (
        <section className={styles.features}>
            <div className={"container"}>
                <h2 className={styles.featuresTitle}>Why Choose Streamura?</h2>

                <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                        <AddFreeIcon className={styles.featureIcon} />
                        <h3 className={styles.featureTitle}>No Ads</h3>
                        <p className={styles.featureText}>
                            Watch any YouTube video without annoying ads
                            interrupting your experience.
                        </p>
                    </div>

                    <div className={styles.featureCard}>
                        <PlaylistMusicIcon className={styles.featureIcon} />
                        <h3 className={styles.featureTitle}>Playlists</h3>
                        <p className={styles.featureText}>
                            Create and manage custom playlists of your favorite
                            videos for easy access.
                        </p>
                    </div>

                    <div className={styles.featureCard}>
                        <RocketIcon className={styles.featureIcon} />
                        <h3 className={styles.featureTitle}>Fast Loading</h3>
                        <p className={styles.featureText}>
                            Videos load quickly without all the extra tracking
                            scripts YouTube includes.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
