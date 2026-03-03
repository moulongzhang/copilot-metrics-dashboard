import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number; // percentage change
    label?: string;
  };
  className?: string;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: MetricCardProps) {
  const TrendIcon = trend
    ? trend.value > 0
      ? TrendingUp
      : trend.value < 0
      ? TrendingDown
      : Minus
    : null;

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className="mt-2">
          <p className="text-3xl font-bold">{value}</p>
          {trend && TrendIcon && (
            <div className="mt-1 flex items-center gap-1">
              <TrendIcon
                className={cn(
                  "h-3 w-3",
                  trend.value > 0
                    ? "text-green-600"
                    : trend.value < 0
                    ? "text-red-600"
                    : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-xs",
                  trend.value > 0
                    ? "text-green-600"
                    : trend.value < 0
                    ? "text-red-600"
                    : "text-muted-foreground"
                )}
              >
                {Math.abs(trend.value).toFixed(1)}%{" "}
                {trend.label || "vs previous period"}
              </span>
            </div>
          )}
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
