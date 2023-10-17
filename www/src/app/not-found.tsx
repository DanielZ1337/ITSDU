import React from 'react'

export default function NotFound() {
    return (
        <main className="flex flex-1 flex-col h-full -mt-12">
            <div className="text-center flex-1 flex flex-col m-auto h-full items-center justify-center">
                <p className="text-base font-semibold text-primary">404</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Page not found</h1>
                <p className="mt-6 text-base leading-7 text-foreground/50">Sorry, we couldn&apos;t find the page you’re
                    looking
                    for.</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a
                        href="/"
                        className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        ← Go home
                    </a>
                </div>
            </div>
        </main>
    )
}