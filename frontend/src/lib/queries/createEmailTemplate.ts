import { instance } from "../api";

export interface CreateEmailTemplatePayload {
  title: string;
  subject: string;
  type: string;
  body: string;
}

export interface CreateEmailTemplateResponse {
  id: string;
  title: string;
  subject: string;
  type: string;
  body: string;
  attachments: [];
  createdAt: string;
  updatedAt: string;
}

export const createEmailTemplate = async (
  data: CreateEmailTemplatePayload
): Promise<CreateEmailTemplateResponse> => {
  const response = await instance.post<CreateEmailTemplateResponse>(
    "/email-templates",
    data
  );
  return response.data;
};
