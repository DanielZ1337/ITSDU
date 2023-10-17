import { Inter as FontSans } from "next/font/google"
import './globals.css'
import { cn } from "@/src/lib/utils"
import Header from "@/src/components/header"
import { Providers } from "@/src/components/providers";
import Footer from "@/src/components/footer";

export const metadata = {
    title: 'ITSDU',
    description: 'ITSDU - SDU itslearning desktop app built for students',
    metadataBase: new URL('https://itsdu.danielz.dev'),
    openGraph: {
        images: [
            {
                url: 'https://itsdu.danielz.dev/og.png',
                width: 1200,
                height: 630,
                alt: 'ITSDU',
            },
        ],
    }
}

export const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased px-4 flex-1 flex flex-col selection:bg-primary/10 overflow-x-hidden",
                    fontSans.variable
                )}
            >
                <Providers>
                    <div className="min-h-screen flex-1 flex flex-col">
                        <Header />
                        {children}
                    </div>
                    <Footer />
                </Providers>
                <div className="dark:opacity-25 absolute left-full top-40 -z-10 -translate-x-full blur-3xl"
                    aria-hidden="true">
                    <div
                        className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#EE7203] to-[#eeeb35] opacity-30"
                        style={{
                            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
                        }}></div>
                </div>
            </body>
        </html>
    )
}