import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UpdateTemplatePayload,
  UpdateTemplateResponse,
  updateTemplate,
} from "@/lib/queries/updateTemplate";

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateTemplateResponse,
    Error,
    { id: string; data: UpdateTemplatePayload }
  >({
    mutationFn: ({ id, data }) => updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mail-templates"] });
      queryClient.invalidateQueries({ queryKey: ["email-template"] });
    },
    onError: (error) => {
      console.error("Error updating email template:", error);
    },
  });
};
