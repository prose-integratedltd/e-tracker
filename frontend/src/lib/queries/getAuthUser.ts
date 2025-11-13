import { instance } from "../api";

export const getAuthUser = async (): Promise<{
  id: string;
  uId: string;
  username: string;
  email: string;
  fullname: string;
  phoneNumber: string;
  password: string;
  departmentId: string
  operationLocationId: string;
  roles: string[];
  profilePicture: string | null;
  updatedAt: string | null;
  createdAt: string;
}> => {
  const response = await instance.get(`/auth/user`);
  return response.data;
};
