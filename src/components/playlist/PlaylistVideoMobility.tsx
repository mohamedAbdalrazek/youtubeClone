import React from "react";
import styles from "./VideoMobility.module.css"
export default function PlaylistVideoMobility({
    currentIndex,
    setCurrentIndex,
    videosLength,
}: {
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    videosLength: number;
}) {
    const handleNext = () => {
        if (currentIndex + 1 === videosLength) {
            return;
        }
        setCurrentIndex((prev) => prev + 1);
    };
    const handleprev = () => {
        if (currentIndex === 0) {
            return;
        }
        setCurrentIndex((prev) => prev - 1);
    };
    return (
        <div className={styles.mobilityWrapper}>
            <span onClick={handleprev} className={`${styles.pointer} ${currentIndex ===0 && styles.disabled}`}>&lt;</span>
            <span>
                {currentIndex + 1}/{videosLength}
            </span>
            <span onClick={handleNext} className={`${styles.pointer} ${currentIndex + 1 === videosLength && styles.disabled}`}>&gt;</span>
        </div>
    );
}
