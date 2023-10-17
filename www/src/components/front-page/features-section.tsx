'use client'

import { useInView } from 'framer-motion'
import { Bell, Files, MousePointerClick } from 'lucide-react'
import React, { useRef } from 'react'

const features = [
    {
        name: "Streamlined Course Navigation",
        description: "Quickly navigate to your courses and assignments with a single click and easily select what you want to see.",
        icon: <MousePointerClick />,
    },
    {
        name: "Quick Resource Management",
        description: "Enjoy a student-centric design with shortcuts and intuitive features, making it a breeze to find, download, and/or open one or multiple resources, saving you time and effort.",
        icon: <Files />
    },
    {
        name: "Instant Notifications",
        description: "Receive important announcements and updates in real-time, so you're always in the loop.",
        icon: <Bell />
    },
    {
        name: "Personalized Dashboard",
        description: "Customize your dashboard to display the information that matters most to you.",
        icon: <MousePointerClick />
    },
]


export default function FeaturesSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const isContainerInView = useInView(containerRef, {
        once: true,
    })
    const contentRef = useRef(null)
    const isContentInView = useInView(contentRef, {
        amount: "some",
    })


    return (
        <section id='features' ref={containerRef} style={{
            transform: isContainerInView ? "none" : "translateX(-100px)",
            opacity: isContainerInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1)"
        }} className="pt-56 sm:pt-64 md:pt-80">
            <div ref={contentRef} style={{
                transform: isContentInView ? "scale(1)" : "scale(0.95)",
                transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1)"
            }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2 className="text-base text-primary font-semibold tracking-wide uppercase text-center">Key Features</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl text-balance text-center">
                        Everything you need to stay on top of your studies
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-foreground/50 lg:mx-auto text-center">
                        This SDU itslearning desktop app for students is designed to help you stay organized and on top of your studies. Here are some of the key features:
                    </p>
                </div>

                <div className="mt-20">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, index) => (
                            <div key={index} className={`group bg-primary/80 overflow-hidden shadow rounded-lg hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:scale-105 dark:hover:bg-primary/60 hover:bg-primary/90 hover:-rotate-3`}>
                                {/* render the feature.icon */}
                                <div className="px-4 py-5 sm:px-6 sm:pt-6">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white dark:group-hover:bg-primary/20 transition-all duration-300 group-hover:bg-primary/90">
                                        {feature.icon}
                                    </div>
                                </div>
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg leading-6 font-medium text-white">{feature.name}</h3>
                                    <div className="mt-2 max-w-xl text-sm text-primary-foreground">
                                        <p>{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
