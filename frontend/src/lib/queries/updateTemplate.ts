import { instance } from "../api";

export interface UpdateTemplatePayload {
  title?: string;
  subject?: string;
  type?: string;
  body?: string;
}

export interface UpdateTemplateResponse {
  id: string;
  title: string;
  subject: string;
  type: string;
  body: string;
  attachments: [];
  createdAt: string;
  updatedAt: string;
}

export const updateTemplate = async (
  id: string,
  data: UpdateTemplatePayload
): Promise<UpdateTemplateResponse> => {
  const response = await instance.patch<UpdateTemplateResponse>(
    `/email-templates/${id}`,
    data
  );
  return response.data;
};
