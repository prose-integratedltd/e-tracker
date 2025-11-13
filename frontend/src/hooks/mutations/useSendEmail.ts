import { instance } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface Attachment {
	filename: string;
	mimetype: string;
}

export interface SendEmailPayload {
	to: string;
	subject: string;
	textBody?: string;
	htmlBody: string;
	attachments: Attachment[];
}

const sendEmail = async (payload: SendEmailPayload) => {
	try {
		const response = await instance.post("/email/send", payload);
		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError;

		throw axiosError.response?.data;
	}
};

export function useSendEmail() {
	return useMutation({ mutationFn: sendEmail });
}
