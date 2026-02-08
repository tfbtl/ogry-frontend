import { useQuery } from "@tanstack/react-query";
import { getStaysTodayActivity } from "../../lib/services/apiBookings";

export function useTodayActivity() {
  const { isPending: isLoading, data: activities } = useQuery({
    queryFn: getStaysTodayActivity,
    queryKey: ["today-activity"],
  });

  return { activities, isLoading };
}
