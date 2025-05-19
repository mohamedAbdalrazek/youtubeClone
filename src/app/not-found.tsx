"use client"
import Image from "next/image";
import React from "react";
import styles from "./NotFound.module.css";
import { useRouter } from "next/navigation";
export default function NotFound({
    statusCode = 404,
    errorMessage = "Page not found",
    isButton = true,
    target = "home",
    buttonText ="Go back home"
}: {
    statusCode?: number;
    errorMessage?: string;
    isButton?: boolean;
    target?: "home" | "reload" | "back";
    buttonText?:string
}) {
    const router = useRouter();
    const handleClick = () => {
        if (target === "home") {
            router.push("/");
        } else if (target === "back") {
            router.back();
        } else if (target === "reload") {
            router.refresh();
        }
    };
    return (
        <div className={styles.notFound}>
            <Image
                src={"/error.png"}
                width={500}
                height={365}
                alt="Not Found"
                className={styles.notFoundImage}
            />
            {statusCode && (
                <p className={styles.errorCode}>Error {statusCode}</p>
            )}

            {errorMessage && (
                <p className={styles.errorMessage}>{errorMessage}</p>
            )}
            {isButton && (
                <button onClick={handleClick} className={styles.notFoundButton}>
                    {buttonText}
                </button>
            )}
        </div>
    );
}
