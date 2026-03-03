"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface DateRangePickerProps {
  since?: string;
  until?: string;
  onChange: (since: string, until: string) => void;
}

export function DateRangePicker({ since, until, onChange }: DateRangePickerProps) {
  const [sinceValue, setSinceValue] = useState(since || "");
  const [untilValue, setUntilValue] = useState(until || "");

  const handleApply = () => {
    onChange(sinceValue, untilValue);
  };

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Input
        type="date"
        value={sinceValue}
        onChange={(e) => setSinceValue(e.target.value)}
        className="w-36"
        placeholder="Start date"
      />
      <span className="text-muted-foreground">—</span>
      <Input
        type="date"
        value={untilValue}
        onChange={(e) => setUntilValue(e.target.value)}
        className="w-36"
        placeholder="End date"
      />
      <Button size="sm" onClick={handleApply}>
        Apply
      </Button>
    </div>
  );
}
