
export function isValidYouTubeUrl(url: string) {
    const regex =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/)?[A-Za-z0-9_-]{11}(&.*)?$/;
    return regex.test(url);
}
export function extractVideoId(url: string) {
    const regex = /(?:v=|\/)([0-9A-Za-z_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : "";
}

