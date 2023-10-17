import image_home from "@/public/screenshots/course-home-1.png";
import Image from "next/image";
export default function ImageUnderHero() {

    return (
        <div
            className="hover:scale-[100.5%] animate-in duration-1000 max-w-full mx-auto mb-32 mt-16 overflow-hidden rounded-lg border bg-foreground/10 p-4 hover:shadow-2xl hover:dark:shadow-primary/10 hover:shadow-primary/20 shadow-lg dark:shadow-primary/5 shadow-primary/15 backdrop-blur-3xl slide-in-from-bottom-3/4"
        >
            <Image src={image_home} alt="Course Home" className="rounded-lg border animate-in fade-in-0 duration-1000 flex justify-left w-full h-full object-cover" />
        </div>
    )
}
