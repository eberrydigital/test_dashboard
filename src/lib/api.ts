import { ApiResponse, TestListItem, TestHistoryResponse, TestsQueryParams } from "@/types/api-types";
import { getJson } from './http';

function buildTestsQuery(params?: TestsQueryParams): Record<string, string> {
  const qp: Record<string, string> = {};
  if (!params) return qp;
  if (params.team) qp.team = params.team;
  if (params.status) qp.status = params.status;
  if (params.flaky) qp.flaky = String(params.flaky);
  return qp;
}

export async function fetchTests(params?: TestsQueryParams): Promise<TestListItem[]> {
  const data = await getJson<ApiResponse<TestListItem[]>>('history/tests', buildTestsQuery(params));
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch tests");
  }
  return data.responseObject;
}

export async function fetchTestHistory(testId: string): Promise<TestHistoryResponse> {
  const data = await getJson<ApiResponse<TestHistoryResponse>>(`history/tests/${testId}`);
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch test history");
  }
  return data.responseObject;
}
