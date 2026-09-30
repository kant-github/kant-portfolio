import Image from "next/image";
import { BrandMark, MailMark } from "@/components/brand-marks";
import { asciiFrame } from "@/lib/ascii-frame";
import { profile, type SocialAccount, type SocialId } from "@/lib/data";

/*
 * One face per platform. Each is a real object with its own material:
 * silver metal, matte black, glossy blue, textured paper. The shared parts
 * (grain, bevel, avatar, letterpress text) are classes in globals.css.
 */

type FaceProps = { account: SocialAccount };

function Grain() {
	return <span aria-hidden="true" className="card-grain" />;
}

function Avatar() {
	return (
		<span className="card-avatar relative block size-11 overflow-hidden rounded-[10px]">
			<Image
				src={profile.avatar}
				alt=""
				width={52}
				height={52}
				className="size-full object-cover"
			/>
		</span>
	);
}

function Print({ handle }: { handle: string }) {
	return (
		<span className="flex flex-col">
			<span className="card-name text-[17px] leading-tight font-semibold tracking-[-0.015em]">
				{profile.name.split(" ")[0].toLowerCase()}.
			</span>
			<span className="card-handle mt-0.5 text-[12.5px] leading-snug whitespace-nowrap">
				{handle}
			</span>
			<span className="card-role mt-3.5 text-[12px] leading-none">
				{profile.role.toLowerCase()}.
			</span>
		</span>
	);
}

function Mark({ id }: { id: SocialId }) {
	return (
		<span
			aria-hidden="true"
			className="card-mark pointer-events-none absolute -top-[4%] -right-[7%] block h-[108%]"
		>
			<BrandMark id={id} className="h-full w-auto" />
		</span>
	);
}

/** Avatar top-left, name and handle bottom-left, mark filling the right. */
function Standard({ account }: FaceProps) {
	return (
		<>
			<Mark id={account.id} />
			<div className="relative z-[2] flex h-full flex-col justify-between p-4">
				<Avatar />
				<Print handle={account.handle} />
			</div>
		</>
	);
}

export function SilverFace({ account }: FaceProps) {
	return (
		<div className="card-face face-silver">
			<span aria-hidden="true" className="card-brush" />
			<Grain />
			<Standard account={account} />
		</div>
	);
}

export function ObsidianFace({ account }: FaceProps) {
	return (
		<div className="card-face face-obsidian">
			<span aria-hidden="true" className="card-dots" />
			<Grain />
			<Standard account={account} />
		</div>
	);
}

export function AzureFace({ account }: FaceProps) {
	return (
		<div className="card-face face-azure">
			<span aria-hidden="true" className="card-lines" />
			<span aria-hidden="true" className="card-gloss" />
			<Grain />
			<Standard account={account} />
		</div>
	);
}

const FRAME = asciiFrame(60, 21);

export function PaperFace({ account }: FaceProps) {
	return (
		<div className="card-face face-paper">
			<span aria-hidden="true" className="card-fibres" />
			<Grain />
			<pre aria-hidden="true" className="card-ascii">
				{FRAME}
			</pre>
			<div className="relative z-[2] flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
				<span className="card-ink text-[24px] leading-none font-extrabold tracking-[-0.03em]">
					{profile.role.toLowerCase()}.
				</span>
				<span className="card-paper-line inline-flex items-center gap-2 text-[12.5px]">
					<MailMark className="size-3.5 shrink-0 text-[#2a2a2e]" />
					{account.handle}
				</span>
			</div>
		</div>
	);
}

export const FACES: Record<SocialId, (props: FaceProps) => React.JSX.Element> =
	{
		x: SilverFace,
		github: ObsidianFace,
		linkedin: AzureFace,
		email: PaperFace,
	};
