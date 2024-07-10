import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Belote Score",
	description: "L'outils en ligne de calcul des points pour la belote",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
	return (
		<html lang="fr">
			<body className={inter.className}>

				<header className="flex justify-around">
					<div className="flex">
						<Image src="/logo.svg" alt="Belote Score" height="80" width="80"/>
						<h1 className="text-slate-100 text-3xl font-bold m-10 ">Belote Score</h1>
					</div>
				</header>

				<div className="flex-column justify-around">
					{children}
					<Analytics />
					<SpeedInsights />
                </div>

				<footer className="flex w-screen justify-around text-sm text-gray-700 my-10 ">
					<p>Made by <a className="underline" target="_blank" href="https://github.com/julien7518">me</a></p>
				</footer>

			</body>
		</html>
	);
}
