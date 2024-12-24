import QuerySearch from "@/components/QuerySearch";
import UrlSearch from "@/components/UrlSearch";
import VideosList from "@/components/VideosList";



export default function Home() {
    return (
        <div>
            <UrlSearch />
            <QuerySearch />
            <VideosList />
        </div>
    );
}
