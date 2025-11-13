import { useMarkNotificationsAsSeen } from "@/hooks/mutations/useMarkNotificationsAsSeen";
import { Notification, NotificationType } from "@/lib/queries/getNotifications";
import debounce from "@/hooks/useDebounce";
import Link from "next/link";
import CloseIcon from "../../icons/close.icon";
import { useEffect, useMemo } from "react";
import { useFetchNotifications } from "@/hooks/queries/useFetchNotifications";

type NotificationModalProps = {
	onClosed: () => void;
};

const NotificationsModal: React.FC<NotificationModalProps> = ({ onClosed }) => {
	const { mutate } = useMarkNotificationsAsSeen();
	const { data } = useFetchNotifications();
	const notifications = useMemo(() => data?.data ?? [], [data?.data]);

	useEffect(() => {
		const unseenNotifications = (
			notifications.filter((n) => !n.seen).map((n) => n.id) ?? []
		).slice(0, 4);

		if (unseenNotifications.length === 0) return;

		mutate({ jobIds: unseenNotifications });

		debounce(() => {}, 100);
	}, [mutate, notifications]);

	return (
		<div
			className="w-full h-full bg-black bg-opacity-70 fixed z-50 top-0 left-0 p-7"
			onClick={onClosed}
		>
			<div
				className="absolute right-0 md:right-[5%] md:top-[81px] top-0 w-full md:w-[650px] mt-2 bg-white border border-gray-300 shadow-lg rounded-[10px] z-10"
				onClick={(e) => e.stopPropagation()}
			>
				<Header onClosed={onClosed} />

				<div className="h-[230px] p-4 overflow-y-auto scrollbar-hide">
					{notifications.map((notification, index) => {
						const isFirst = index === 0;
						return (
							<div key={notification.id}>
								<NotificationTile
									className={isFirst ? "" : "mt-4"}
									notification={notification}
								/>
							</div>
						);
					})}

					<div className="text-end mt-2 text-[#02A4FF]">
						{notifications.length > 0 && (
							<Link href={"/notifications"}>Show More</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotificationsModal;

const Header = ({ onClosed }: { onClosed?: () => void }) => {
	return (
		<div className="flex items-center justify-between p-4 border-b">
			<h2 className="text-xl font-semibold font-poppins">
				Notifications
			</h2>
			<button
				className="text-gray-500 hover:text-gray-700"
				onClick={onClosed}
			>
				<CloseIcon />
			</button>
		</div>
	);
};

const NotificationTile = ({
	notification,
	className,
}: {
	notification: Notification;
	className: string;
}) => {
	const message = notification.message.split("{id-link}");

	const idLabel =
		(notification?.data?.jId || notification?.data?.uId) ??
		notification?.data?.id;

	const id = notification?.data?.uId ?? notification?.data?.id;

	const getLink = () => {
		switch (notification.type) {
			case NotificationType.Job:
				return `/jobs/edit/${id}`;

			case NotificationType.User:
				return `/users/${id}`;

			case NotificationType.EmailTemplate:
				return `/email-template/${id}`;

			default:
				return ``;
		}
	};

	return (
		<div className={`flex items-center gap-4 border-b py-4 ${className}`}>
			<div
				className={`h-[10px] w-[10px] ${
					notification.seen ? "bg-[#c3c3c3]" : "bg-[#4DDE53]"
				} rounded`}
			></div>

			<div className="gap-4 flex-1">
				<h2 className="text-lg pb-1 font-[500] font-poppins leading-[21px]">
					{notification.title}
				</h2>
				<p className="text-[#686868] font-poppins font-[400] leading-[21px] ">
					{message?.[0]}
					<Link
						className="text-[#02A4FF] cursor-pointer"
						href={getLink()}
					>
						{idLabel}
					</Link>
					{message?.[1]}
				</p>
			</div>
		</div>
	);
};
