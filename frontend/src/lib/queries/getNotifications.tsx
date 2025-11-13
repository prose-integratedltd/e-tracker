import { instance } from "../api";

export type NotificationData = {
	id: string;
	jId?: string;
	uId?: string;
	userId?: string;
	name: string;
};

export enum NotificationType {
	Job = "Job",
	User = "User",
	Department = "Department",
	OperationLocation = "OperationLocation",
	EmailTemplate = "EmailTemplate",
}

export type Notification = {
	id: string;
	title: string;
	message: string;
	type: NotificationType;
	data: NotificationData;
	seen: boolean;
	createdAt: string;
	updatedAt: string;
};

export type NotificationResponse = {
	data: Notification[];
	numberOfNotification: number;
	page: number;
	nextPage: number | null;
	prevPage: number | null;
	totalPages: number;
};

export const getNotifications = async (): Promise<NotificationResponse> => {
	const response = await instance.get("/notifications");
	return response.data;
};
