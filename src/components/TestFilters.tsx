import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface TestFiltersProps {
  teams: string[];
  selectedTeam?: string;
  onTeamChange: (team: string | undefined) => void;
  onReset: () => void;
}

export const TestFilters = ({
  teams,
  selectedTeam,
  onTeamChange,
  onReset,
}: TestFiltersProps) => {
  const hasActiveFilters = selectedTeam !== undefined;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <Select
              value={selectedTeam || "all"}
              onValueChange={(value) => onTeamChange(value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team} value={team}>
                    {team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
