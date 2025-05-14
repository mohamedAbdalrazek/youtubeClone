"use client"
import Filter from "@/components/search/Filter";
import VideosList from "./VideosList";
import React from "react";
import { useOpenedBox } from "@/context/OpenedBoxContext";

export default function Page() {
    const { setOpenedBoxId } = useOpenedBox();
    return (
        <div
            onClick={() => setOpenedBoxId(null)}
            style={{
                padding: "2rem",
                maxWidth: " 1600px",
                margin: " 0 auto",
            }}
        >
            <Filter />

            <VideosList />
        </div>
    );
}
