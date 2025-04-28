import React from "react";
export const dynamic = "force-dynamic";
import VideoPage from "@/components/refactor/VideoPage";
import { Metadata } from "next";

type Props = {
    params: Promise<{ videoId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export async function generateMetadata({
    params,
    searchParams,
}: Props): Promise<Metadata> {
    const { videoId } = await params;
    const param = await searchParams;
    const title =
        typeof param.title === "string" ? param.title : "Streamura";

    return {
        title: title,
        openGraph: {
            title: title,
            images: [
                {
                    url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                    width: 1280,
                    height: 720,
                },
            ],
        },
    };
}

export default async function Page({
    params,
}: {
    params: Promise<{ videoId: string }>;
}) {
    const { videoId } = await params;

    return <VideoPage videoId={videoId} />;
}
