"use client";
import React from "react";
import styles from "@/css/Skeleton.module.css";

export default function VideoListSkeleton({ number }: { number: number }) {
    return (
        <div className={styles.skeletonWrapper}>
            <div className={styles.skeletonInfo}>
                {Array.from({ length: number }, (_, index: number) => (
                    <div className={styles.skeletonCard} key={index}>
                        <div className={styles.skeletonIcon} />
                        <div className={styles.skeletonInfo}>
                            <div className={styles.skeletonTitle} />
                            <div className={styles.skeletonDate} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
