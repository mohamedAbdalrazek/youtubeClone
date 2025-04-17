"use client"
import React from "react";
import styles from "@/css/Skeleton.module.css";

export default function VideoPageSkeleton({ number }: { number: number }) {
    return (
        <div className={styles.skeletonWrapper}>
            <div className={styles.skeletonLineTall} />
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonDate} />
            <div className={styles.skeletonInfo}>
                {Array.from({ length: number }, (_, index: number) => (
                    <div className={styles.skeletonLine} key={index} />
                ))}
            </div>
        </div>
    );
}
