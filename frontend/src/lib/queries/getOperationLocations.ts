import { instance } from "../api";

export const getOperationLocations = async (): Promise<
  { id: string; name: string }[]
> => {
  const response = await instance.get("/operation-locations");
  return response.data;
};
