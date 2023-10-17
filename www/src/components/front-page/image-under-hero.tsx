import image_home from "@/public/screenshots/course-home-1.png";
import Image from "next/image";
export default function ImageUnderHero() {

    return (
        <div
            className="animate-in duration-1000 max-w-full mx-auto my-32 overflow-hidden rounded-lg border bg-foreground/10 p-4 shadow-lg shadow-primary/5 backdrop-blur-3xl slide-in-from-bottom-3/4"
        >
            <Image src={image_home} alt="Course Home" className="rounded-lg border animate-in fade-in-0 duration-1000 flex justify-left w-full h-full object-cover" />
        </div>
    )
}
