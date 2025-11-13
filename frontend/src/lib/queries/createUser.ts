import { instance } from "../api";

export interface CreateUserPayload {
  username: string;
  email: string;
  fullname: string;
  phoneNumber: string;
  departmentId: string;
  operationLocationId: string;
  roles: string[];
  password: string;
}

export interface CreateUserResponse {
  id: string;
  username: string;
  email: string;
  fullname: string;
  phoneNumber: string;
  departmentId: string;
  operationLocationId: string;
  roles: string[];
}

export const createUser = async (
  data: CreateUserPayload
): Promise<CreateUserResponse> => {
  const response = await instance.post<CreateUserResponse>("/users/add", data);
  return response.data;
};
