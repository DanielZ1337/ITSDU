'use client'

import { motion, useInView } from "framer-motion"
import { useRef } from "react";
import { FaWindows } from "react-icons/fa"
import { IconType } from "react-icons/lib"
import { SiApple, SiLinux } from "react-icons/si"
import Link from "next/link"
import { ExternalLinkIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

const platforms: { name: string, icon: IconType, link: string }[] = [
    { name: "Windows", icon: FaWindows, link: '/yes' },
    { name: "macOS", icon: SiApple, link: '' },
    { name: "Linux", icon: SiLinux, link: '' },
]

export default function PlatformsSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const isContainerInView = useInView(containerRef, {
        once: true,
    })
    const contentRef = useRef(null)
    const isContentInView = useInView(contentRef, {
        amount: "some",
    })


    return (
        <section id='platforms' ref={containerRef} className="py-6 md:py-18 my-36" style={{
            transform: isContainerInView ? "none" : "translateX(-100px)",
            opacity: isContainerInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1)"
        }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-[4rem] py-32"
                ref={contentRef}
                style={{
                    transform: isContentInView ? "scale(1)" : "scale(0.95)",
                    transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1)"
                }}
            >
                <div className="text-center">
                    <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Available Now</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl text-balance">
                        Download on Your Platform
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-foreground/50 lg:mx-auto">
                        ITSDU is available for download now on Windows in alpha. macOS and Linux versions are coming in
                        the future.
                    </p>
                </div>

                <div className="mt-10 flex flex-col items-center justify-center md:block">
                    <ul
                        className="md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10 ">
                        {platforms.map(({ name, icon: Icon, link }, idx) => (
                            <motion.li
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.3, duration: 0.5 }}
                                key={name} className="mt-10 md:mt-0 "
                            >
                                <div className="flex items-center md:justify-center">
                                    <div className="flex-shrink-0">
                                        <div
                                            className="flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-md bg-primary text-white">
                                            <Icon className="h-6 w-6 sm:h-10 sm:w-10" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <Link className={cn("text-lg leading-6 font-medium text-primary/50 hover:underline inline-flex gap-2 items-center justify-center", !link && 'text-destructive line-through hover:line-through cursor-not-allowed')} href={link}>{name}<ExternalLinkIcon /></Link>
                                    </div>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}