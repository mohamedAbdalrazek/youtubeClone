import Filter from "@/components/search/Filter";
import VideosList from "./VideosList";
import React from "react";

export default function page() {
    return (
        <div
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
