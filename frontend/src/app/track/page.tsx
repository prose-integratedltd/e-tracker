import TrackingInput from "./components/TrackingInput";
import Navbar from "@/app/component/Navbar";
import trackAction from "./action/tacking";

export default function TrackPage() {
	return (
		<>
			<Navbar showShadow={true} backgroundColor="bg-white" />

			<section className="flex flex-col mt-44 items-center justify-center gap-10">
				<h1 className="text-[#19469D] font-[600] text-xl md:text-2xl">
					Track Your Package
				</h1>

				<form
					className="flex items-center text-lg pl-4 pr-2 py-2 border border-[#19469D] md:min-w-[607px]"
					action={trackAction}
				>
					<TrackingInput initialValue={""} />
				</form>

				<p className="text-gray-600 text-sm md:text-base text-center max-w-md">
					Enter your tracking ID to view the current status and updates for your shipment.
				</p>
			</section>
		</>
	);
}
