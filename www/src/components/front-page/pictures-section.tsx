'use client'

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import Image1 from '@/public/screenshots/course-home.png';
import Image2 from '@/public/screenshots/course-home.png';
import Image3 from '@/public/screenshots/course-home.png';
import Image from 'next/image';

export default function PicturesSection() {
    const ref1 = useRef(null)
    const ref2 = useRef(null)
    const ref3 = useRef(null)
    const ref1InView = useInView(ref1, { once: true })
    const ref2InView = useInView(ref2, { once: true })
    const ref3InView = useInView(ref3, { once: true })

    return (
        <div className="relative max-w-full mx-auto py-32 overflow-hidden">
            <div className='translate-x-1/2'>
                <Image ref={ref1} src={Image1} alt="Course Home" className="flex justify-left w-full h-full object-cover" style={{
                    transform: ref1InView ? "scale(1)" : "scale(0.95)",
                    transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1)"
                }} />
            </div>
            <div className='translate-x-1/2'>
                <Image ref={ref2} src={Image2} alt="Course Home" className="flex justify-left w-full h-full object-cover" style={{
                    transform: ref2InView ? "scale(1)" : "scale(0.95)",
                    transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1)"
                }} />
            </div>
            <div className='translate-x-1/2'>
                <Image ref={ref3} src={Image3} alt="Course Home" className="flex justify-left w-full h-full object-cover" style={{
                    transform: ref3InView ? "scale(1)" : "scale(0.95)",
                    transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1)"
                }} />
            </div>
        </div>
    );
}
