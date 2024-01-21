import { cn } from "@/lib/utils"
import { ItslearningRestApiEntitiesLightBulletinsLightBulletinImage } from "@/types/api-types/utils/Itslearning.RestApi.Entities.LightBulletins.LightBulletinImage"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Loader } from "@/components/ui/loader"

export default function LightbulletinImage({ image }: { image: ItslearningRestApiEntitiesLightBulletinsLightBulletinImage }) {
    const [isLoaded, setIsLoaded] = useState(false)

    //const customImage = Math.random() > 0.5

    //const imgSrc = customImage ? "https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=neom-abjEGTj3HZY-unsplash.jpg" : image.OriginalFileUrl

    const imgSrc = image.OriginalFileUrl

    useEffect(() => {
        const img = new Image()
        img.onload = () => setIsLoaded(true)

        img.src = imgSrc
    }, [])

    const ImageComponent = ({ className }: { className?: string }) => (
        <img
            loading="lazy"
            src={imgSrc}
            className={cn("object-contain m-auto flex w-full items-center justify-center", className)} />
    )

    return (
        <div
            className="w-fit shrink-0 m-auto flex max-h-full flex-col items-center justify-center rounded-md p-4 ring ring-purple-500/50 bg-foreground/10">
            <div
                className="m-auto flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-sm">
                {isLoaded && (
                    <Dialog>
                        <DialogTrigger>
                            <ImageComponent className="max-h-96" />
                        </DialogTrigger>
                        <DialogContent
                            className={"md:w-full break-all bg-foreground/5 p-12 backdrop-blur-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-opacity-50 max-h-[80dvh] max-w-[80dvw]"}>
                            <div className={"w-full h-full mx-auto overflow-hidden"}>
                                <ImageComponent className="max-h-full max-w-full w-full h-full rounded-none" />
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
                {!isLoaded && (
                    <div className="absolute flex h-full w-full items-center justify-center">
                        <Loader className={"animate-spin stroke-current text-gray-500 m-auto"} />
                    </div>
                )}
            </div>
        </div>
    )
}
