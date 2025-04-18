"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import styles from "@/css/VideoList.module.css";
import { formatRelativeDate } from "@/utils/utils";
import VideoListSkeleton from "./VideoListSkeleton";
type Item = {
    videoId: string;
    title: string;
    date: string;
    url: string;
    height: number;
    width: number;
    channelTitle: string;
};
const Search = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("search");
    const [data, setData] = useState<Item[]>();
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if(!query){
            return
        }
        setLoading(true)
        fetch(`/api/searchVideos?query=${query}`)
            .then((res) => res.json())
            .then((data) => {
                setData(data.formedData);
            }).finally(()=>{
                setLoading(false)
            });
    }, [query]);

    if(loading){
        return <VideoListSkeleton number={10} />
    }
    return (
        <div className={styles.resultsContainer}>
            {data?.map((item) => {
                return (
                    item.videoId && (
                        <Link
                            key={item.videoId}
                            href={`/watch/${item.videoId}?title=${item.title
                                .split(" ")
                                .join("+")}`}
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
};
export default function VideosList() {
    return (
        <Suspense>
            <Search />
        </Suspense>
    );
}
