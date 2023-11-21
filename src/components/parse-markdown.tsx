import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {cn} from "@/lib/utils";
// import remarkMath from "remark-math";
import CodeBlock from "@/components/code-block";

interface ComponentTypes {
    className?: string;
    href?: string;

    [key: string]: any;
}

function ParseMarkdown({
                           code,
                           codeCopyable = false,
                       }: {
    code: string;
    codeCopyable?: boolean;
}) {
    const components = {
        h1: ({className, ...props}: ComponentTypes) => (
            <h1
                className={cn(
                    "mt-2 scroll-m-20 text-3xl font-bold tracking-tight first:mt-0",
                    className
                )}
                {...props}
            />
        ),
        h2: ({className, ...props}: ComponentTypes) => (
            <h2
                className={cn(
                    "mt-4 scroll-m-20 pb-1 text-2xl font-semibold tracking-tight first:mt-0",
                    className
                )}
                {...props}
            />
        ),
        h3: ({className, ...props}: ComponentTypes) => (
            <h3
                className={cn(
                    "mt-4 scroll-m-20 text-lg font-medium tracking-tight first:mt-0",
                    className
                )}
                {...props}
            />
        ),
        h4: ({className, ...props}: ComponentTypes) => (
            <h4
                className={cn(
                    "text-md mt-8 scroll-m-20 font-medium tracking-tight",
                    className
                )}
                {...props}
            />
        ),
        h5: ({className, ...props}: ComponentTypes) => (
            <h5
                className={cn(
                    "text-md mt-8 scroll-m-20 font-medium tracking-tight",
                    className
                )}
                {...props}
            />
        ),
        h6: ({className, ...props}: ComponentTypes) => (
            <h6
                className={cn(
                    "mt-8 scroll-m-20 text-base font-medium tracking-tight",
                    className
                )}
                {...props}
            />
        ),
        a: ({className, href, ...props}: ComponentTypes) => {
            const isHashURL = href?.includes("#"); // Ex. https://example.com#section
            const isExternalURL = href?.includes("://"); // Ex. https://example.com

            return (
                <a
                    className={cn(
                        "font-medium underline underline-offset-4",
                        className
                    )}
                    {...props}
                    href={href}
                    target={isHashURL || !isExternalURL ? "_self" : "_blank"}
                />
            );
        },
        p: ({className, ...props}: ComponentTypes) => (
            <p
                className={cn("leading-7 [&:not(:first-child)]:mt-4", className)}
                {...props}
            />
        ),
        ul: ({className, ...props}: ComponentTypes) => (
            <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
        ),
        ol: ({className, ...props}: ComponentTypes) => (
            <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
        ),
        li: ({className, ...props}: ComponentTypes) => (
            <li className={cn("mt-2", className)} {...props} />
        ),
        blockquote: ({className, ...props}: ComponentTypes) => (
            <blockquote
                className={cn(
                    "mt-6 border-l-2 pl-6 italic [&>*]:text-gray-500",
                    className
                )}
                {...props}
            />
        ),
        img: ({className, alt, src, ...props}: ComponentTypes) => (
            <img
                className={cn("w-full h-auto my-2 inline-flex rounded-md border object-contain", className)}
                src={src}
                alt={alt}
                {...props}
            />
        ),
        hr: ({...props}: ComponentTypes) => (
            <hr className="my-4 md:my-8" {...props} />
        ),
        table: ({
                    className,
                    ...props
                }: React.HTMLAttributes<HTMLTableElement>) => (
            <div className="my-6 w-full rounded-lg">
                <table className={cn("w-full", className)} {...props} />
            </div>
        ),
        tr: ({
                 className,
                 ...props
             }: React.HTMLAttributes<HTMLTableRowElement>) => (
            <tr
                className={cn("m-0 border-t p-0 even:bg-muted", className)}
                {...props}
            />
        ),
        th: ({className, ...props}: ComponentTypes) => (
            <th
                className={cn(
                    "border px-4 py-2 text-left font-bold  [&[align=center]]:text-center [&[align=right]]:text-right",
                    className
                )}
                {...props}
            />
        ),
        td: ({className, ...props}: ComponentTypes) => (
            <td
                className={cn(
                    "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
                    className
                )}
                {...props}
            />
        ),
        pre: ({className, ...props}: ComponentTypes) => (
            <pre className={cn("flex w-full", className)} {...props} />
        ),
        video: ({className, ...props}: ComponentTypes) => (
            <video
                className={cn("my-4 inline-flex rounded-md border", className)}
                {...props}
                controls
            />
        ),
        code({inline, className, children, ...props}: ComponentTypes) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
                <CodeBlock
                    value={String(children).replace(/\n$/, "")}
                    language={match[1]}
                    {...props}
                    copyable={codeCopyable}
                />
            ) : (
                <code
                    {...props}
                    className={cn("rounded-sm border px-1 py-0.5 w-fit overflow-x-auto", className)}
                >
                    {children}
                </code>
            );
        },
    };

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={components}
        >
            {code}
        </ReactMarkdown>
    );
}

export default ParseMarkdown;