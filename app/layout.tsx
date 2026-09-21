import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { profile } from "@/lib/data";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: profile.name,
	description: `${profile.role} based in ${profile.location}, building backend systems at scale and the product interfaces on top of them.`,
	openGraph: {
		title: profile.name,
		description: `${profile.role} based in ${profile.location}.`,
		type: "profile",
	},
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
		>
			<head>
				{/* Staged sections render hidden and are revealed by JS. If JS never
				    arrives, put everything back rather than leaving a blank page. */}
				<noscript>
					<style>{".stage{--p:1 !important}"}</style>
				</noscript>
			</head>
			<body className="min-h-full">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
