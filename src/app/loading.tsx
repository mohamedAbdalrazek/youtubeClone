import React from 'react'
import styles from "@/css/Loading.module.css"
export default function loading() {
  return (
    <div className={styles.loaderWrapper}>
        
        <span className={styles.loader}></span>
    </div>
  )
}
