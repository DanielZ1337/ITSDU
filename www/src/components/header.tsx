'use client'

import React, { useEffect, useState } from 'react'
import LogoSvg from "@/src/components/logo-svg";
import { ThemeToggle } from "@/src/components/theme-toggle";
import { LucideDownload, LucideGithub } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/src/components/ui/button";

export default function Header() {

    const headerRef = React.useRef<HTMLDivElement>(null);
    const [isSticky, setIsSticky] = useState(false);


    useEffect(() => {
        const scrollListener = () => {
            if (headerRef.current) {
                setIsSticky(window.scrollY > headerRef.current.getBoundingClientRect().top - headerRef.current.clientTop);
            }
        }

        scrollListener();

        window.addEventListener('scroll', scrollListener);

        return () => {
            window.removeEventListener('scroll', scrollListener);
        }
    }, [headerRef, isSticky]);

    return (
        <header data-issticky={isSticky} ref={headerRef}
            className="z-50 data-[issticky=true]:md:px-10 fixed left-0 right-0 px-4 md:sticky w-5/6 md:w-full top-4 transform transition-all duration-300 xl:mt-14 md:mt-8 mt-4 container rounded-2xl shadow-md data-[issticky=false]:shadow-lg data-[issticky=false]:shadow-primary/20 data-[issticky=true]:bg-opacity-80 backdrop-saturate-200 backdrop-blur border border-primary/10 data-[issticky=false]:max-w-screen-xl lg:rounded-full lg:pl-6 py-3 dark:bg-primary/60 bg-primary/90 shadow-primary/20 hover:shadow-primary/10 hover:shadow-lg">
            <div className='flex justify-between items-center'>
                <Link href={'/'} className="w-fit">
                    <LogoSvg className="w-full md:max-h-8 max-h-6 text-black fill-black invert" />
                </Link>
                <div className="flex items-center md:gap-x-4 gap-x-2">
                    <Link href={'/download'} className={buttonVariants({
                        variant: 'ghostPrimary',
                        size: 'sm'
                    })}>
                        <span className={"hidden sm:block text-white"}>
                            Download
                        </span>
                        <span className={"sm:hidden"}>
                            <LucideDownload className={"text-white h-[1.3rem] w-[1.3rem]"} />
                        </span>
                    </Link>
                    <Link href={'https://github.com/DanielZ1337/itslearning'} className={buttonVariants({
                        variant: 'ghostPrimary',
                        size: 'icon'
                    })}>
                        <LucideGithub
                            className="text-white h-[1.3rem] w-[1.3rem]" />
                    </Link>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}
