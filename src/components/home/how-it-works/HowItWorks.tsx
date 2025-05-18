import React from "react";
import styles from "./HowItWorks.module.css";

export default function HowItWorks() {
    return (
        <section className={styles.howItWorks}>
            <div className="container">
                <h2>How Streamura Works</h2>
                <div className={styles.steps}>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>1</div>
                        <h3>Search or Paste a Link</h3>
                        <p>
                            Find any YouTube video or playlist using the search bar —
                            or just paste a link directly.
                        </p>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>2</div>
                        <h3>Watch Without Distractions</h3>
                        <p>
                            Stream instantly in an ad-free interface for a clean,
                            uninterrupted viewing experience.
                        </p>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>3</div>
                        <h3>Save & Organize</h3>
                        <p>
                            Sign in to save full YouTube playlists, create your playlists,
                            build watch-later lists, and fully manage your content.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
