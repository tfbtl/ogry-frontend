import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateCabinUseCase } from "../../shared/composition/cabinUseCases";

export function useEditCabin() {
  const queryClient = useQueryClient();

  const { mutate: editCabin, isLoading: isEditing } = useMutation({
    mutationFn: async ({ newCabinData, id }) => {
      const result = await updateCabinUseCase.execute(id, newCabinData);
      if (!result.ok) {
        throw new Error(result.error.messageKey);
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Cabin successfully edited");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editCabin };
}
