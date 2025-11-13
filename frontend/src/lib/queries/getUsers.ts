import { instance } from "../api";
import qs from "qs";

type User = {
  id: string;
  uId: string;
  username: string;
  email: string;
  fullname: string;
  phoneNumber: string;
};

export type Data = {
  data: User[];
  totalPages: number;
};

type GetUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export const getUsers = async (params?: GetUsersParams): Promise<Data> => {
  const queryString = qs.stringify(params, { skipNulls: true, encode: true });
  const response = await instance.get(
    `/users${queryString ? `?${queryString}` : ""}`
  );
  return response.data;
};
