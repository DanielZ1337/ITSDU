import {cn} from "@/src/lib/utils";
import {buttonVariants} from "@/src/components/ui/button";

export default function HeroSection() {
    return (
        <div id={"hero"} className="mx-auto max-w-xl text-center lg:flex-auto lg:py-20 text-balance">
            <h2 className="animate-in fade-in-0 in slide-in-from-bottom-8 duration-700 text-3xl font-bold tracking-tight sm:text-4xl md:text-6xl text-balance">
                Elevate Your SDU Learning Experience
            </h2>
            <p className="animate-in fade-in-0 in slide-in-from-bottom-8 duration-700 mt-6 text-lg leading-8 dark:text-gray-300 text-gray-600 text-balance">
                Take control of your academic journey with a custom-built, student-centric desktop app for SDU&apos;s itslearning platform.
            </p>
            <div className="animate-in fade-in-0 in slide-in-from-bottom-8 duration-700 mt-10 flex items-center justify-center gap-x-10">
                <a
                    href="/download"
                    className={cn(buttonVariants({
                        size: 'lg'
                    }), "px-3.5 py-2.5 text-sm font-semibold shadow-sm")}
                >
                    Download Now
                </a>
                <a href="#features" className={cn(buttonVariants({
                    variant: 'link'
                }), "px-3.5 py-2.5 text-sm font-semibold leading-6 group inline-flex gap-2 hover:no-underline")}>
            <span className="group-hover:underline">
              Learn more
            </span>
                    <span className="group-hover:translate-x-1/3 transform transition-all !no-underline group-hover:!no-underline" aria-hidden="true">→</span>
                </a>
            </div>
        </div>
    )
}