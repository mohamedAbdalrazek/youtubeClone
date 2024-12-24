"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "@/css/VideoList.module.css";
type Item = {
    videoId: string;
    title: string;
    date: string;
    url: string;
    height: number;
    width: number;
    channelTitle: string;
};
export default function VideosList() {
    function formatRelativeDate(isoDateString: string): string {
        const date = new Date(isoDateString);
        const now = new Date();
        const diffInSeconds = Math.floor(
            (now.getTime() - date.getTime()) / 1000
        );

        const timeUnits: { unit: string; seconds: number }[] = [
            { unit: "year", seconds: 60 * 60 * 24 * 365 },
            { unit: "month", seconds: 60 * 60 * 24 * 30 },
            { unit: "week", seconds: 60 * 60 * 24 * 7 },
            { unit: "day", seconds: 60 * 60 * 24 },
            { unit: "hour", seconds: 60 * 60 },
            { unit: "minute", seconds: 60 },
            { unit: "second", seconds: 1 },
        ];

        for (const { unit, seconds } of timeUnits) {
            const count = Math.floor(diffInSeconds / seconds);
            if (count >= 1) {
                return count === 1 ? `1 ${unit} ago` : `${count} ${unit}s ago`;
            }
        }

        return "just now";
    }

    const searchParams = useSearchParams();
    const query = searchParams.get("search");
    const [data, setData] = useState<Item[]>();

    useEffect(() => {
        fetch(`http://localhost:3000/api/searchVideos?query=${query}`)
            .then((res) => res.json())
            .then((data) => {
                setData(data.formedData);
            });
    }, [query]);
    return (
        <div className={styles.resultsContainer}>
            {data?.map((item) => {
                return (
                    item.videoId && (
                        <Link
                            key={item.videoId}
                            href={`/watch/${item.videoId}?title=${item.title.split(" ").join("+")}`}
                            className={styles.resultsLink}
                        >
                            <div className={styles.resultItem}>
                                <div className={styles.thumbnail}>
                                    <Image
                                        src={item.url}
                                        width={item.width}
                                        height={item.height}
                                        alt={item.title}
                                        className={styles.image}
                                    />
                                </div>
                                <div className={styles.details}>
                                    <h3 className={styles.title}>
                                        {item.title}
                                    </h3>
                                    <span className={styles.date}>
                                        {formatRelativeDate(item.date)}
                                    </span>
                                    <span className={styles.channelTitle}>
                                        {item.channelTitle}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    )
                );
            })}
        </div>
    );
}
