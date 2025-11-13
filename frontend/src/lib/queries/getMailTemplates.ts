import { instance } from "../api";
import qs from "qs";

type Template = {
  id: string;
  title: string;
  type: string;
  subject: string;
  body: string;
  attachments: [];
  createdAt: string;
  updatedAt: string;
};

export type Data = {
  data: Template[];
  totalPages: number;
};

type GetTemplatesParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export const getMailTemplates = async (
  params?: GetTemplatesParams
): Promise<Data> => {
  const queryString = qs.stringify(params, { skipNulls: true, encode: true });
  const response = await instance.get(
    `/email-templates${queryString ? `?${queryString}` : ""}`
  );
  return response.data;
};
