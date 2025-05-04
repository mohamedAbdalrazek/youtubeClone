import React from "react";
import styles from "./HowItWorks.module.css"
export default function HowItWorks() {
    return (
        <section className={styles.howItWorks}>
            <div className="container">
                <h2>How Streamura Works</h2>
                <div className={styles.steps}>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>1</div>
                        <h3>Paste YouTube URL</h3>
                        <p>
                            Copy any YouTube video link and paste it into
                            Streamura
                        </p>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>2</div>
                        <h3>Enjoy Ad-Free Viewing</h3>
                        <p>
                            Watch immediately without any ads or interruptions
                        </p>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>3</div>
                        <h3>Save to Playlists</h3>
                        <p>Organize your favorite videos in custom playlists</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
