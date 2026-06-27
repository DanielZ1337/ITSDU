import { useAboutModal } from "@/hooks/atoms/useAboutModal";
import { useVersion } from "@/hooks/atoms/useVersion";
import { Link } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
} from "./ui/dialog";

export default function AboutModal() {
	const { setShowAboutModal, showAboutModal } = useAboutModal();
	const { version } = useVersion();

	return (
		<Dialog open={showAboutModal} onOpenChange={setShowAboutModal}>
			<DialogOverlay />
			<DialogPortal>
				<DialogContent className="md:w-fit">
					<DialogHeader>
						<DialogTitle>About</DialogTitle>
						<DialogDescription className="flex flex-col">
							<span className="text-sm text-gray-500">
								Version {version}. Update controls are available in Settings.
							</span>
							<span className="text-sm text-gray-500">
								ITSDU - SDU itslearning desktop app built for students
							</span>
						</DialogDescription>
					</DialogHeader>
					<div className="flex p-4">
						<div className="mr-6 flex shrink-0 flex-col">
							<img
								loading="lazy"
								src="itsl-itslearning-file://i_logo_colored.png"
								alt="ITSDU Logo"
								className="mx-auto h-20 w-20"
							/>
							<hr className="my-6" />
							<img
								loading="lazy"
								src="itsl-itslearning-file://icon.ico"
								alt="itslearning Logo"
								className="mx-auto h-20 w-20"
							/>
						</div>
						<p className="text-sm text-gray-500">
							ITSDU is a desktop app built for students at SDU to access
							itslearning in a more convenient way.
							<br />
							<br />
							ITSDU is not affiliated with itslearning or SDU in any way.
							<br />
							<br />
							ITSDU is built by students for students.
						</p>
					</div>
					<DialogFooter className="flex items-center sm:justify-between w-full">
						<a
							className="transition-all group text-sm text-[#ee7203] hover:underline text-[14px] font-medium flex items-center gap-1 cursor-pointer"
							onClick={() =>
								void window.app.openExternal(
									"https://itsdu.danielz.dev/releases",
									false,
								)
							}
						>
							Releases{" "}
							<Link className="inline-block ml-1 size-[1em] stroke-white group-hover:stroke-[#ee7203] transition-all transform rotate-180 group-hover:rotate-0 stroke-[2px] group-hover:stroke-[2.5px]" />
						</a>
						<button
							className="text-sm text-gray-500 hover:underline"
							onClick={() =>
								void window.app.openExternal("https://danielz.dev", false)
							}
						>
							Created by Daniel Bermann Schmidt
						</button>
					</DialogFooter>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	);
}
