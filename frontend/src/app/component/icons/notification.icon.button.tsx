import { useFetchNotifications } from "@/hooks/queries/useFetchNotifications";
import NotificationIcon from "./notification.icon";
import NotificationBadge from "../common/notification.badge";
import Link from "next/link";

type NotificationIconButtonProp = {
	onShowDropdown?: () => void;
};

const NotificationIconButton = ({
	onShowDropdown,
}: NotificationIconButtonProp) => {
	const { data } = useFetchNotifications();
	const notifications = data?.data ?? [];
	const unSeenNotifications = data?.data.filter((n) => !n.seen) ?? [];
	const canShowDropDown = notifications.length;

	if (canShowDropDown) {
		return (
			<div
				className={style}
				onClick={notifications.length > 0 ? onShowDropdown : () => {}}
			>
				<NotificationIcon />

				{unSeenNotifications.length > 0 && (
					<NotificationBadge count={unSeenNotifications.length} />
				)}
			</div>
		);
	}

	return (
		<Link
			className={style}
			href="/notifications"
			onClick={notifications.length > 0 ? onShowDropdown : () => {}}
		>
			<NotificationIcon />

			{unSeenNotifications.length > 0 && (
				<NotificationBadge count={unSeenNotifications.length} />
			)}
		</Link>
	);
};

const style = `
    w-[54px]
    h-[54px]
    rounded-[10px]
    bg-[#EFEFEF]
    hidden
    sm:flex
    items-center
    justify-center
    cursor-pointer
    relative
`;

export default NotificationIconButton;
