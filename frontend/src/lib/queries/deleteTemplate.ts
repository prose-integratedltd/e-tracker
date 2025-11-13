import { instance } from "../api";

export const deleteTemplate = async (id: string): Promise<void> => {
  await instance.delete(`/email-templates/${id}`);
};
