import React from "react";

export default function AddPlaylistIcon({className}:{className?:string}) {
    return (
        <svg
            width="800px"
            className={className}
            height="800px"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                width="208"
                height="32"
                x="256"
                y="152"
                fill="var(--ci-primary-color, #000000)"
            />
            <rect
                width="288"
                height="32"
                x="176"
                y="256"
                fill="var(--ci-primary-color, #000000)"
            />
            <rect
                width="288"
                height="32"
                x="176"
                y="360"
                fill="var(--ci-primary-color, #000000)"
            />
            <polygon
                fill="var(--ci-primary-color, #000000)"
                points="192 152 128 152 128 88 96 88 96 152 32 152 32 184 96 184 96 248 128 248 128 184 192 184 192 152"
            />
        </svg>
    );
}
