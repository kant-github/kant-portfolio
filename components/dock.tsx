import {
	RiArrowUpLine,
	RiGithubFill,
	RiHome5Fill,
	RiLinkedinFill,
	RiMailFill,
	RiTwitterXFill,
} from "react-icons/ri";
import { profile, socials } from "@/lib/data";

type DockItem = {
	name: string;
	href: string;
	icon: typeof RiHome5Fill;
	external?: boolean;
};

const ITEMS: DockItem[] = [
	{ name: "Home", href: "#top", icon: RiHome5Fill },
	{
		name: "Email",
		href: `mailto:${profile.email}`,
		icon: RiMailFill,
	},
	{
		name: "GitHub",
		href: socials.github,
		icon: RiGithubFill,
		external: true,
	},
	{ name: "X", href: socials.x, icon: RiTwitterXFill, external: true },
	{
		name: "LinkedIn",
		href: socials.linkedin,
		icon: RiLinkedinFill,
		external: true,
	},
];

const BUTTON_CLASS =
	"group/item relative flex size-11 items-center justify-center rounded-full text-dock-ink transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-dock-hover hover:text-white focus-visible:bg-dock-hover focus-visible:text-white focus-visible:outline-none active:translate-y-0";

// The tooltip is the one thing that fades, because it has to appear and
// disappear. The dock itself is always fully solid.
const TIP_CLASS =
	"pointer-events-none invisible absolute -top-11 left-1/2 -translate-x-1/2 translate-y-1 scale-95 rounded-lg bg-dock-tip px-2.5 py-1.5 font-mono text-[10px] leading-none tracking-label whitespace-nowrap text-white uppercase opacity-0 shadow-dock-tip ring-1 ring-dock-tip-edge transition duration-200 ease-out group-hover/item:visible group-hover/item:translate-y-0 group-hover/item:scale-100 group-hover/item:opacity-100 group-focus-visible/item:visible group-focus-visible/item:translate-y-0 group-focus-visible/item:scale-100 group-focus-visible/item:opacity-100";

export function Dock() {
	return (
		<div className="dock-in pointer-events-none fixed inset-x-0 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4">
			<nav
				aria-label="Quick links"
				className="dock-surface dock-edge pointer-events-auto relative flex items-center gap-1 rounded-full p-1.5 shadow-dock"
			>
				{ITEMS.map((item) => {
					const Icon = item.icon;

					return (
						<a
							key={item.name}
							href={item.href}
							target={item.external ? "_blank" : undefined}
							rel={item.external ? "noreferrer" : undefined}
							aria-label={item.name}
							className={BUTTON_CLASS}
						>
							<Icon className="size-5" aria-hidden="true" />
							<span className={TIP_CLASS} aria-hidden="true">
								{item.name}
							</span>
						</a>
					);
				})}

				<span
					className="mx-1 h-6 w-px bg-linear-to-b from-dock-divider-top to-dock-divider-bottom"
					aria-hidden="true"
				/>

				<a
					href="#top"
					aria-label="Back to top"
					className={BUTTON_CLASS}
				>
					<RiArrowUpLine className="size-5" aria-hidden="true" />
					<span className={TIP_CLASS} aria-hidden="true">
						Back to top
					</span>
				</a>
			</nav>
		</div>
	);
}
