import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createCabinUseCase } from "../../shared/composition/cabinUseCases";

export function useCreateCabin() {
  const queryClient = useQueryClient();

  const { mutate: createCabin, isLoading: isCreating } = useMutation({
    mutationFn: async (newCabin) => {
      const result = await createCabinUseCase.execute(newCabin);
      if (!result.ok) {
        throw new Error(result.error.messageKey);
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("New cabin successfully created");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createCabin };
}
