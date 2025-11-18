import { useQuery } from "@tanstack/react-query";
import { fetchTestHistory } from "@/lib/api";

export function useTestHistory(testId: string) {
  return useQuery({
    queryKey: ["test-history", testId],
    queryFn: () => fetchTestHistory(testId),
    enabled: !!testId,
  });
}
