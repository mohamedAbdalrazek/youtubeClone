import React from "react";

export default function PlaylistMusicIcon({className}:{className?:string}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            data-name="Layer 1"
            viewBox="0 0 24 24"
            className={className}
        >
            <path d="m19,0c-1.654,0-3,1.346-3,3v10.602c-.751-.385-1.6-.602-2.5-.602-3.032,0-5.5,2.467-5.5,5.5s2.468,5.5,5.5,5.5,5.5-2.467,5.5-5.5V3h5V0h-5Zm-5.5,21c-1.379,0-2.5-1.122-2.5-2.5s1.121-2.5,2.5-2.5,2.5,1.122,2.5,2.5-1.121,2.5-2.5,2.5Zm-.5-18H0V0h13v3Zm0,6H0v-3h13v3Zm-6.134,6H0v-3h9.756c-1.224.706-2.229,1.748-2.89,3Z" />
        </svg>
    );
}
