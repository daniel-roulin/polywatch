import Link from "next/link";
import Image from "next/image";

export default function Header() {
	return (
		<header className="fixed top-0 left-0 w-full h-16 bg-white text-black border-b-4 border-black">
			<nav className="h-full flex-row flex gap-16 items-center mx-8">
				<Link href="/" className="w-fit py-1 h-full">
				{/* TODO: Replace with svg in component (https://www.reddit.com/r/nextjs/comments/181453h/optimal_way_to_use_icons/) */}
					<Image
						src="/icon.svg"
						alt="Logo"
						width={368}
						height={80}
						className="w-full h-full"
					/>
				</Link>
				<Link href="/students">
					<h2 className="text-2xl font-medium">Search</h2>
				</Link>
				<Link href="/students">
					<h2 className="text-2xl font-medium">Sections</h2>
				</Link>
				<Link href="/students">
					<h2 className="text-2xl font-medium">Years</h2>
				</Link>
				<Link href="/students">
					<h2 className="text-2xl font-medium">Courses</h2>
				</Link>
				<Link href="/students">
					<h2 className="text-2xl font-medium">Plan</h2>
				</Link>
				<Link href="/students" className="ml-auto">
					<h2 className="text-2xl font-medium">About</h2>
				</Link>
			</nav>
		</header>

	);
}