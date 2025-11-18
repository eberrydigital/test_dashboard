import { useQuery } from "@tanstack/react-query";
import { fetchTests } from "@/lib/api";
import { TestsQueryParams } from "@/types/api-types";

export function useTests(params?: TestsQueryParams) {
  return useQuery({
    queryKey: ["tests", params],
    queryFn: () => fetchTests(params),
  });
}
