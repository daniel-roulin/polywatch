import Link from "next/link";
import Image from "next/image";

export default function Header() {
	return (
		<header className="fixed top-0 left-0 w-full h-16 bg-white text-black border-b-4 border-black">
			<nav className="h-full flex-row flex gap-16 items-center mx-8">
				<Link href="/" className="w-fit py-1 h-full">
					<Image
						src="/icon.svg"
						alt="Logo"
						width={368}
						height={80}
						className="w-full h-full"
					/>
				</Link>
				<Link href="/students" className="flex-none text-2xl font-semibold">
					Search
				</Link>
				<Link href="/students" className="flex-none text-2xl font-semibold">
					Sections
				</Link>
				<Link href="/students" className="flex-none text-2xl font-semibold">
					Years
				</Link>
				<Link href="/students" className="flex-none text-2xl font-semibold">
					Courses
				</Link>
				<Link href="/students" className="flex-none text-2xl font-semibold">
					Plan
				</Link>
				<Link href="/students" className="flex-none ml-auto text-2xl font-semibold">
					About
				</Link>
			</nav>
		</header>
		
	);
}