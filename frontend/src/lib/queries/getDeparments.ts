import { instance } from "../api";

export const getDepartments = async (): Promise<
  { id: string; name: string }[]
> => {
  const response = await instance.get("/departments");
  return response.data; 
};
