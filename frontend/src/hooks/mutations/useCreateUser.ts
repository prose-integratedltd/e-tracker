import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  // CreateUserPayload,
  // CreateUserResponse,
  createUser,
} from "@/lib/queries/createUser";

// export const useCreateUser = () =>
//   useMutation<CreateUserResponse, Error, CreateUserPayload>({
//     mutationFn: (data: CreateUserPayload) => createUser(data),
//   });

  export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: createUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
      onError: (error) => {
        console.error("Error creating user:", error);
      },
    });
  };
