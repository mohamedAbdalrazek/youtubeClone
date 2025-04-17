import React from "react";
export const dynamic = "force-dynamic";
import VideoPage from "./VideoPage";
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
    console.log(param.title);
    const title =
        typeof param.title === "string" ? param.title : "Clean Youtube";

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
