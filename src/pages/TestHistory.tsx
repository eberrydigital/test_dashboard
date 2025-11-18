import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTestHistory } from "@/hooks/useTestHistory";
import { StatsCard } from "@/components/StatsCard";
import { CheckCircle2, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const formatDuration = (ms: number): string => {
  if (ms === 0) return "N/A";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text);
  toast({
    title: "Copied to clipboard",
    description: `${label} has been copied`,
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "passed":
      return "bg-success/10 text-success hover:bg-success/20";
    case "failed":
      return "bg-destructive/10 text-destructive hover:bg-destructive/20";
    case "timedOut":
      return "bg-warning/10 text-warning hover:bg-warning/20";
    default:
      return "bg-muted text-muted-foreground hover:bg-muted/80";
  }
};

const TestHistory = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { data: testData, isLoading, error } = useTestHistory(testId!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !testData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-destructive font-semibold">Test not found</p>
              <p className="text-muted-foreground text-sm mt-2">
                {error?.message || "The requested test could not be found"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalPassed = testData.history.reduce((sum, run) => sum + run.totalPassAttempts, 0);
  const totalFailed = testData.history.reduce((sum, run) => sum + run.totalFailAttempts, 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <CardTitle className="text-2xl">{testData.title}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{testData.team}</Badge>
                    {testData.flakyFlag && (
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        Flaky Test
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono">{testData.testId}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => copyToClipboard(testData.testId, "Test ID")}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            label="Overall Success Rate"
            value={`${testData.successRatePercent}%`}
            icon={<CheckCircle2 className="h-8 w-8" />}
          />
          <StatsCard
            label="Total Passed"
            value={totalPassed}
            icon={<CheckCircle2 className="h-8 w-8 text-success" />}
          />
          <StatsCard
            label="Total Failed"
            value={totalFailed}
            icon={<XCircle className="h-8 w-8 text-destructive" />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Execution History ({testData.history.length} runs)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4 p-6">
              {testData.history.map((run) => (
                <Card key={run.runId} className="overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={getStatusColor(run.status)}>
                            {run.status}
                          </Badge>
                          <Badge variant="outline">{run.project}</Badge>
                          <Badge variant="outline">{run.team}</Badge>
                          {run.device && <Badge variant="outline">{run.device}</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-4 flex-wrap">
                            <span>Run ID: {run.runId}</span>
                            <span>Retries: {run.attempts.length - 1}</span>
                            <span>{formatDate(run.finishedAt)}</span>
                          </div>
                        </div>
                      </div>
                      {run.htmlReportUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(run.htmlReportUrl, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Report
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Retry</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Error</TableHead>
                          <TableHead className="text-right">Report</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {run.attempts.map((attempt) => (
                          <TableRow key={attempt.retry}>
                            <TableCell className="font-medium">#{attempt.retry}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(attempt.status)}>
                                {attempt.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {formatDuration(attempt.durationMs)}
                            </TableCell>
                            <TableCell className="max-w-md">
                              {attempt.errorMessage && (
                                <span className="text-xs text-destructive truncate block">
                                  {attempt.errorMessage}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {attempt.htmlReportUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(attempt.htmlReportUrl, "_blank")}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestHistory;
