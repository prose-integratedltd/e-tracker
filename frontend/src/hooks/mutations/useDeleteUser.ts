import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/lib/queries/deleteUser";
// import { toast } from "react-toastify"; 

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // toast.success("User deleted successfully!"); 
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
      // toast.error("Error deleting user!"); 
    },
  });
};
