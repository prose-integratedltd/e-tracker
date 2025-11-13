import { Attachment } from "@/hooks/mutations/useSendEmail";
import { instance } from "../api";

export const getTemplate = async (
	id: string
): Promise<{
	id: string;
	title: string;
	type: string;
	subject: string;
	body: string;
	attachments: Attachment[];
	createdAt: string;
	updatedAt: string;
}> => {
	const response = await instance.get(`/email-templates/${id}`);
	return response.data;
};
