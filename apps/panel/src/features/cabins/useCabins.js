import { useQuery } from "@tanstack/react-query";
import { getCabinsUseCase } from "../../shared/composition/cabinUseCases";

export function useCabins() {
  const {
    isLoading,
    data: cabins,
    error,
  } = useQuery({
    queryKey: ["cabins"],
    queryFn: async () => {
      const result = await getCabinsUseCase.execute();
      if (!result.ok) {
        throw new Error(result.error.messageKey);
      }
      return result.data;
    },
  });

  return { isLoading, error, cabins };
}
