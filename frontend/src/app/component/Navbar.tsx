import Image from "next/image";
import Link from "next/link";

type NavbarProps = {
	lightLogo?: boolean;
	showShadow?: boolean;
	backgroundColor?: string;
};

const Navbar = ({
	lightLogo = false,
	showShadow = false,
	backgroundColor = "bg-transparent",
}: NavbarProps) => {
	return (
		<div
			className={`flex items-center md:px-[10%] px-4 justify-between w-full mx-auto fixed z-30 top-0 left-0 h-[100px] ${backgroundColor} $ ${
				showShadow && "shadow-md"
			}`}
		>
			<Link className="w-[100px] md:w-full" href="/">
				<Image
					src={`/logos/${lightLogo ? "home-logo" : "logo"}.png`}
					alt="Prose logo"
					width={170}
					height={40}
				/>
			</Link>

			<div className="flex w-full justify-end items-center gap-4">
				<Link
					href="#about"
					className="font-poppins font-medium md:text-lg text-sm"
				>
					About Us
				</Link>
				<Link
					href="#contact"
					className="font-poppins font-medium  md:text-lg text-sm"
				>
					Contact Us
				</Link>
			</div>
		</div>
	);
};

export default Navbar;
