export function formatRelativeDate(isoDateString: string): string {
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

export function formatDate(dateString: string | undefined): string {
    if (dateString) {
        const date = new Date(dateString);

        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "short",
            day: "numeric",
        };
        return new Intl.DateTimeFormat("en-US", options).format(date);
    }
    return ""
}
export function formatNumberWithCommas(number: number | undefined) {
    if (number)
        return new Intl.NumberFormat("en-US").format(number);

    return ""

}
export function htmlDecode(input: string) {
    if (typeof window !== "undefined") {
        const doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    }
    else {
        return input
    }
}