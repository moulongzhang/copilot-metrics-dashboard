import { InboxIcon } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = "No data available",
  message = "There is no metrics data for the selected period.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <InboxIcon className="h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-semibold text-muted-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
