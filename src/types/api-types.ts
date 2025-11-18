export interface ApiResponse<T> {
  success: boolean;
  message: string;
  responseObject: T;
}

export interface TestListItem {
  testId: string;
  title: string;
  team: string;
  successRate: number;
  successRatePercent: number;
  averageDurationMs: number;
  lastRunDate?: string;
  totalRuns: number;
  flakyFlag: boolean;
  lastStatus?: "passed" | "failed" | "skipped" | "timedOut";
}

export interface Attempt {
  retry: number;
  status: string;
  durationMs: number;
  startedAt: string;
  finishedAt: string;
  errorMessage?: string;
  htmlReportUrl?: string;
}

export interface HistoryRunItem {
  runId: string;
  status: string;
  project: string;
  team: string;
  device?: string;
  attempts: Attempt[];
  htmlReportUrl?: string;
  totalPassAttempts: number;
  totalFailAttempts: number;
  finishedAt?: string;
  title: string;
}

export interface TestHistoryResponse {
  testId: string;
  title: string;
  team: string;
  successRate: number;
  successRatePercent: number;
  averageDurationMs: number;
  totalRuns: number;
  flakyFlag: boolean;
  history: HistoryRunItem[];
}

export interface TestsQueryParams {
  team?: string;
  status?: string;
  flaky?: "true" | "false";
}
