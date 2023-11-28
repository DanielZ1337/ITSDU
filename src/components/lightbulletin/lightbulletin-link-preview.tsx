import useGETLinkOGPreview from '@/queries/extra/useGETLinkOGPreview'
import LightbulletinLink from './lightbulletin-link'

export default function LightbulletinLinkPreview({ href, title }: { href: string, title: string }) {

    const { data } = useGETLinkOGPreview(href, {
        suspense: true,
        useErrorBoundary: false,
    })

    return (
        <LightbulletinLink
            onClick={() => window.app.openShell(href)}
        >
            <img src={"https://www.google.com/s2/favicons?sz=64&domain_url=" + href} alt={href}
                className={"w-6 h-6"} />
            <span className="truncate">{data?.title || title}</span>
        </LightbulletinLink>
    )
}