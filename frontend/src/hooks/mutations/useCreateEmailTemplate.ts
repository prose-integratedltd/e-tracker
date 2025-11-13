import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  // CreateEmailTemplatePayload,
  // CreateEmailTemplateResponse,
  createEmailTemplate,
} from "@/lib/queries/createEmailTemplate";

export const useCreateEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmailTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mail-templates"] });
    },
  });
};
