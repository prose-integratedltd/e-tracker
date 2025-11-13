const notificationBadgeStyle = `
    bg-[#FF6C6C]
    absolute
    -top-2
    -right-2
    flex
    justify-center
    items-center
    rounded-full
    font-poppins
    font-semibold
    text-white
    text-[12px]
    h-4
`;

const NotificationBadge = ({ count }: { count: number }) => {
	return (
		<div
			className={`${notificationBadgeStyle} ${
				count < 10 ? "w-4" : "w-8"
			}`}
		>
			{count > 99 ? "99+" : count}
		</div>
	);
};

export default NotificationBadge;
