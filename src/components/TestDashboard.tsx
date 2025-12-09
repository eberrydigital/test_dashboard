import { useMemo, useState } from "react";
import { StatsCard } from "./StatsCard";
import { TestFilters } from "./TestFilters";
import { TestInstancesTable } from "./TestInstancesTable";
import { CheckCircle2, AlertTriangle, TestTube } from "lucide-react";
import { useTests } from "@/hooks/useTests";

export const TestDashboard = () => {
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>(undefined);

  const { data: tests, isLoading, error } = useTests(
    selectedTeam ? { team: selectedTeam } : undefined
  );

  const stats = useMemo(() => {
    if (!tests) {
      return {
        total: 0,
        passed: 0,
        failed: 0,
        flaky: 0,
        passRate: "0.0",
      };
    }

    const total = tests.length;
    const passed = tests.filter(t => t.successRatePercent === 100).length;
    const failed = tests.filter(t => t.successRatePercent === 0 && t.totalRuns > 0).length;
    const flaky = tests.filter(t => t.flakyFlag).length;

    const totalWithRuns = tests.filter(t => t.totalRuns > 0);
    const passRate = totalWithRuns.length > 0
      ? (totalWithRuns.reduce((sum, t) => sum + t.successRate, 0) / totalWithRuns.length * 100).toFixed(1)
      : "0.0";

    return {
      total,
      passed,
      failed,
      flaky,
      passRate,
    };
  }, [tests]);

  const handleReset = () => {
    setSelectedTeam(undefined);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-destructive font-semibold">Error loading tests</p>
          <p className="text-muted-foreground text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Test Results Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor and analyze tests
            </p>
          </div>
          <div className="flex items-start justify-between gap-6">
            <span
                className="text-2xl font-semibold tracking-wide text-foreground/80"
                aria-label="Brand placeholder"
            >QA Chapter
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Tests"
            value={stats.total}
            icon={<TestTube className="h-8 w-8" />}
          />
          <StatsCard
            label="Overall Success Rate"
            value={`${stats.passRate}%`}
            icon={<CheckCircle2 className="h-8 w-8" />}
          />
          <StatsCard
            label="Healthy Tests"
            value={stats.passed}
            icon={<CheckCircle2 className="h-8 w-8 text-success" />}
          />
          <StatsCard
            label="Flaky Tests"
            value={stats.flaky}
            icon={<AlertTriangle className="h-8 w-8 text-warning" />}
          />
        </div>

        <TestFilters
          teams={tests ? Array.from(new Set(tests.map(t => t.team))).sort() : []}
          selectedTeam={selectedTeam}
          onTeamChange={setSelectedTeam}
          onReset={handleReset}
        />

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Test Instances ({stats.total})
          </h2>
          <TestInstancesTable data={tests || []} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};
