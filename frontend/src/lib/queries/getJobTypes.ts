import { instance } from "../api";

export const getJobTypes = async (): Promise<
  { id: string; name: string }[]
> => {
  const response = await instance.get("/job-types");
  return response.data;
};
