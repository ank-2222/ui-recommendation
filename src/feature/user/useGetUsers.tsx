import { getUserListService } from "@/services/user";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = (limit: number, skip: number) => {
  return useQuery({
    queryKey: ["users", limit, skip], 
    queryFn: () => getUserListService({ limit, skip }),
  });
};
