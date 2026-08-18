"use server";

import Image from "next/image";
import React from "react";
import Link from "next/link";
import Navbar from "./component/Navbar";
import trackAction from "./track/action/tacking";

const Home = () => {
	return (
		<div className="w-full ">
			<section
				className="h-[750px] md:px-[10%] px-4 flex flex-col items-center justify-center gap-3 text-white text-center w-full"
				style={{
					backgroundImage: "url('/tracker/backgrounds/landing-image.png')",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<Navbar lightLogo={true} />

				<h3 className="bg-[#09B0B5A1] text-white md:w-[370px] w-full h-[56px] rounded-full flex items-center justify-center md:text-2xl font-poppins font-semibold">
					Fast, Safe & Reliable
				</h3>
				<h1 className="font-poppins md:text-5xl text-xl font-bold mt-5">
					One-Stop Logistics Company
				</h1>
				<p className="font-poppins font-medium md:mt-2 md:text-lg">
					A global leading firm on logistics and transportation
					services
				</p>

				<form
					action={trackAction}
					className="mt-6 flex items-center shadow-md w-full max-w-3xl h-[56px]"
				>
					<input
						type="text"
						name="trackingId"
						placeholder="PIL-0402251236-4a6f686e"
						className="w-[80%] h-full bg-white px-4 py-2 text-black placeholder:text-[#979797] outline-none"
					/>
					<button className="w-[20%] h-full bg-[#19469D] text-white">
						Track
					</button>
				</form>
			</section>

			<section
				id="about"
				className="bg-[#1D1D1D] py-[130px] px-[8%] text-white"
			>
				<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
					{[
						{
							title: "Air Freight",
							desc: "We understand that Air transport services are the most valuable when it comes to moving express shipments around the globe and therefore provide shipment of goods through an air carrier securely",
							icon: "/tracker/svg/air.png",
						},
						{
							title: "Sea Freight",
							desc: "We specialize in managing the movement and shipment process for our clients; coordinating the processes so that products/shipments arrive at specified locations in the fastest, safest and most efficient manner possible.",
							icon: "/tracker/svg/sea.png",
						},
						{
							title: "Road Freight",
							desc: "We specialize in managing the movement and transportation process for our clients; coordinating the processes so that products arrive at specified locations in the fastest, safest and most efficient manner possible.",
							icon: "/tracker/svg/road.png",
						},
					].map((service, index) => (
						<div
							key={index}
							className="bg-[#09B0B5] w-full h-[450px] p-8 text-center shadow-lg"
						>
							<div className="flex items-center justify-center w-[100px] h-[100px] mx-auto">
								<Image
									src={service.icon}
									alt=""
									width={70}
									height={70}
								/>
							</div>
							<h2 className="text-3xl font-poppins font-bold mt-2">
								{service.title}
							</h2>
							<p className="mt-2 text-white font-poppins font-medium">
								{service.desc}
							</p>
						</div>
					))}
				</div>
			</section>

			<footer
				id="contact"
				className="bg-[#09B0B5] text-white pt-10 pb-20 px-[8%] text-center md:text-left"
			>
				<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
					<div>
						<h3 className="text-xl font-semibold font-poppins">
							Headquarters
						</h3>
						<p className="font-poppins mt-2">
							PLOT 784 HERBERT MACUALAY WAY CENTRAL BUSINESS
							DISTRICT ABUJA
						</p>
					</div>
					<div>
						<h3 className="text-xl font-semibold font-poppins">
							Contact
						</h3>
						<div className="mt-2 flex items-center gap-2">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M2 7L10.1649 12.7154C10.8261 13.1783 11.1567 13.4097 11.5163 13.4993C11.8339 13.5785 12.1661 13.5785 12.4837 13.4993C12.8433 13.4097 13.1739 13.1783 13.8351 12.7154L22 7M6.8 20H17.2C18.8802 20 19.7202 20 20.362 19.673C20.9265 19.3854 21.3854 18.9265 21.673 18.362C22 17.7202 22 16.8802 22 15.2V8.8C22 7.11984 22 6.27976 21.673 5.63803C21.3854 5.07354 20.9265 4.6146 20.362 4.32698C19.7202 4 18.8802 4 17.2 4H6.8C5.11984 4 4.27976 4 3.63803 4.32698C3.07354 4.6146 2.6146 5.07354 2.32698 5.63803C2 6.27976 2 7.11984 2 8.8V15.2C2 16.8802 2 17.7202 2.32698 18.362C2.6146 18.9265 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20Z"
									stroke="white"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>

							<p className="font-poppins">admin@proseintegratedltd.com</p>
						</div>
						<div className="mt-5 flex gap-2">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M8.38028 8.85323C9.07627 10.3028 10.0251 11.6615 11.2266 12.8631C12.4282 14.0646 13.7869 15.0134 15.2365 15.7094C15.3612 15.7693 15.4235 15.7992 15.5024 15.8222C15.7828 15.904 16.127 15.8453 16.3644 15.6752C16.4313 15.6274 16.4884 15.5702 16.6027 15.4559C16.9523 15.1063 17.1271 14.9315 17.3029 14.8172C17.9658 14.3862 18.8204 14.3862 19.4833 14.8172C19.6591 14.9315 19.8339 15.1063 20.1835 15.4559L20.3783 15.6508C20.9098 16.1822 21.1755 16.448 21.3198 16.7333C21.6069 17.3009 21.6069 17.9712 21.3198 18.5387C21.1755 18.8241 20.9098 19.0898 20.3783 19.6213L20.2207 19.7789C19.6911 20.3085 19.4263 20.5733 19.0662 20.7756C18.6667 21 18.0462 21.1614 17.588 21.16C17.1751 21.1588 16.8928 21.0787 16.3284 20.9185C13.295 20.0575 10.4326 18.433 8.04466 16.045C5.65668 13.6571 4.03221 10.7947 3.17124 7.76131C3.01103 7.19687 2.93092 6.91464 2.9297 6.5017C2.92833 6.04347 3.08969 5.42298 3.31411 5.02348C3.51636 4.66345 3.78117 4.39863 4.3108 3.86901L4.46843 3.71138C4.99987 3.17993 5.2656 2.91421 5.55098 2.76987C6.11854 2.4828 6.7888 2.4828 7.35636 2.76987C7.64174 2.91421 7.90747 3.17993 8.43891 3.71138L8.63378 3.90625C8.98338 4.25585 9.15819 4.43065 9.27247 4.60643C9.70347 5.26932 9.70347 6.1239 9.27247 6.78679C9.15819 6.96257 8.98338 7.13738 8.63378 7.48698C8.51947 7.60129 8.46231 7.65845 8.41447 7.72526C8.24446 7.96269 8.18576 8.30695 8.26748 8.5873C8.29048 8.6662 8.32041 8.72854 8.38028 8.85323Z"
									stroke="white"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>

							<div>
								<p>+234(0)8053155515</p>
								<p>+234(0)8033306940</p>
							</div>
						</div>
					</div>
					<div>
						<h3 className="text-xl font-semibold font-poppins">
							Headquarters
						</h3>
						<Link
							href="https://proseintegratedltd.com/about-us/"
							className="font-poppins font-medium block mt-2 underline"
						>
							About Us
						</Link>
						<Link
							href="https://proseintegratedltd.com/contact-us/"
							className="font-poppins font-medium block mt-2 underline"
						>
							Contact Us
						</Link>
					</div>
				</div>
				<div className="mt-10 flex items-center gap-16">
					<Image
						src="/tracker/logos/image 6.png"
						alt=""
						width={280}
						height={80}
					/>
					<Image
						src="/tracker/logos/image 7.png"
						alt=""
						width={120}
						height={180}
					/>
				</div>
			</footer>
		</div>
	);
};

export default Home;
