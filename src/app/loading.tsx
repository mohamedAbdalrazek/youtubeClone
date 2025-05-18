import React from "react";
import styles from "@/css/Loading.module.css";
export default function Loading({ height }: { height?: string }) {
    return (
        <div style={{ height }}  className={styles.loaderWrapper}>
            <span className={styles.loader}></span>
        </div>
    );
}
