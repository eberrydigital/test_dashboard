import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TestListItem } from "@/types/api-types";
import { Skeleton } from "@/components/ui/skeleton";

interface TestInstancesTableProps {
  data: TestListItem[];
  isLoading: boolean;
}

const formatDuration = (ms: number): string => {
  if (ms === 0) return "N/A";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
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

const getStatusColor = (status?: string) => {
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

export const TestInstancesTable = ({ data, isLoading }: TestInstancesTableProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">No test results found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test ID</TableHead>
                <TableHead>Test Name</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-center">Success Rate</TableHead>
                <TableHead className="text-right">Avg Duration</TableHead>
                <TableHead className="text-center">Total Runs</TableHead>
                <TableHead className="text-center">Last Status</TableHead>
                <TableHead className="text-right">Last Run</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((test) => (
                <TableRow
                  key={test.testId}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/test/${test.testId}`)}
                >
                  <TableCell className="font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-[120px]">{test.testId}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(test.testId, "Test ID");
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[400px]">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{test.title}</span>
                      {test.flakyFlag && (
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                          Flaky
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{test.team}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`font-semibold ${
                        test.successRatePercent === 100
                          ? "text-success"
                          : test.successRatePercent >= 75
                          ? "text-warning"
                          : "text-destructive"
                      }`}
                    >
                      {test.successRatePercent}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatDuration(test.averageDurationMs)}
                  </TableCell>
                  <TableCell className="text-center">{test.totalRuns}</TableCell>
                  <TableCell className="text-center">
                    {test.lastStatus && (
                      <Badge variant="outline" className={getStatusColor(test.lastStatus)}>
                        {test.lastStatus}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {formatDate(test.lastRunDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
