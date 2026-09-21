import {
	RiArrowUpLine,
	RiBriefcase4Fill,
	RiBuilding2Fill,
	RiChat3Fill,
	RiImage2Fill,
	RiMailFill,
	RiQuillPenFill,
	RiStackFill,
} from "react-icons/ri";
import { ScrollRing } from "@/components/scroll-ring";

type DockItem = {
	name: string;
	href: string;
	icon: typeof RiStackFill;
};

const SECTIONS: DockItem[] = [
	{ name: "Work", href: "#work", icon: RiBriefcase4Fill },
	{ name: "Experience", href: "#experience", icon: RiBuilding2Fill },
	{ name: "Testimonials", href: "#testimonials", icon: RiChat3Fill },
	{ name: "Stack", href: "#stack", icon: RiStackFill },
	{ name: "Writing", href: "#writing", icon: RiQuillPenFill },
	{ name: "Personal", href: "#personal", icon: RiImage2Fill },
	{ name: "Contact", href: "#contact", icon: RiMailFill },
];

const BUTTON_CLASS =
	"group/item relative flex size-8 items-center justify-center rounded-md text-dock-ink transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-dock-hover hover:text-white focus-visible:bg-dock-hover focus-visible:text-white focus-visible:outline-none active:translate-y-0 sm:size-9";

// The tooltip is the one thing that fades, because it has to appear and
// disappear. The dock itself is always fully solid.
const TIP_CLASS =
	"pointer-events-none invisible absolute -top-9 left-1/2 -translate-x-1/2 translate-y-1 scale-95 rounded-lg bg-dock-tip px-2.5 py-1.5 font-mono text-[10px] leading-none tracking-label whitespace-nowrap text-white uppercase opacity-0 shadow-dock-tip ring-1 ring-dock-tip-edge transition duration-200 ease-out group-hover/item:visible group-hover/item:translate-y-0 group-hover/item:scale-100 group-hover/item:opacity-100 group-focus-visible/item:visible group-focus-visible/item:translate-y-0 group-focus-visible/item:scale-100 group-focus-visible/item:opacity-100";

export function Dock() {
	return (
		<div className="dock-in pointer-events-none fixed inset-x-0 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4">
			<nav
				aria-label="Sections"
				className="dock-surface dock-edge pointer-events-auto relative flex items-center gap-0.5 rounded-shot p-1.5 shadow-dock"
			>
				{SECTIONS.map((item) => {
					const Icon = item.icon;

					return (
						<a
							key={item.name}
							href={item.href}
							aria-label={item.name}
							className={BUTTON_CLASS}
						>
							<Icon
								className="size-4.5 sm:size-3.5"
								aria-hidden="true"
							/>
							<span className={TIP_CLASS}>{item.name}</span>
						</a>
					);
				})}

				<span
					className="mx-0.5 h-5 w-px bg-linear-to-b from-dock-divider-top to-dock-divider-bottom"
					aria-hidden="true"
				/>

				<a
					href="#top"
					aria-label="Back to top"
					className={BUTTON_CLASS}
				>
					<ScrollRing />
					<RiArrowUpLine
						className="size-4 sm:size-3.5"
						aria-hidden="true"
					/>
					<span className={TIP_CLASS}>Back to top</span>
				</a>
			</nav>
		</div>
	);
}
