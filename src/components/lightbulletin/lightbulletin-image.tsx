import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ItslearningRestApiEntitiesLightBulletinsLightBulletinImage } from "@/types/api-types/utils/Itslearning.RestApi.Entities.LightBulletins.LightBulletinImage";
import { ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function LightbulletinImage({
	image,
}: {
	image: ItslearningRestApiEntitiesLightBulletinsLightBulletinImage;
}) {
	const [isLoaded, setIsLoaded] = useState(false);

	//const customImage = Math.random() > 0.5

	//const imgSrc = customImage ? "https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=neom-abjEGTj3HZY-unsplash.jpg" : image.OriginalFileUrl

	const imgSrc = image.OriginalFileUrl;

	useEffect(() => {
		const img = new Image();
		img.onload = () => setIsLoaded(true);

		img.src = imgSrc;
	}, []);

	const ImageComponent = ({ className }: { className?: string }) => (
		<img
			loading="lazy"
			src={imgSrc}
			className={cn(
				"object-contain m-auto flex w-full items-center justify-center",
				className,
			)}
		/>
	);

	return (
		<div className="w-full flex max-h-full flex-col items-center justify-center rounded-lg overflow-hidden border border-border/50 bg-muted/30">
			<div className="flex h-full w-full flex-col items-center justify-center overflow-hidden">
				{isLoaded && (
					<Dialog>
						<DialogTrigger className="w-full">
							<ImageComponent className="max-h-96 hover:opacity-90 transition-opacity cursor-zoom-in" />
						</DialogTrigger>
						<DialogContent
							className={
								"md:w-full break-all bg-foreground/5 p-12 backdrop-blur-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-opacity-50 max-h-[80dvh] max-w-[80dvw]"
							}
						>
							<div className={"w-full h-full mx-auto overflow-hidden"}>
								<ImageComponent className="max-h-full max-w-full w-full h-full rounded-none" />
							</div>
						</DialogContent>
					</Dialog>
				)}
				{!isLoaded && (
					<Skeleton className="w-full h-48 flex items-center justify-center">
						<ImageIcon className="w-8 h-8 text-muted-foreground/50" />
					</Skeleton>
				)}
			</div>
		</div>
	);
}
