import { instance } from "../api";

export const deleteUser = async (id: string): Promise<void> => {
  await instance.delete(`/users/${id}`);
};
