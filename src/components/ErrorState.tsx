import { AlertCircle, KeyRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  title?: string;
  message: string;
  isAuthError?: boolean;
}

export function ErrorState({ title, message, isAuthError }: ErrorStateProps) {
  return (
    <Card className="border-destructive/50">
      <CardContent className="flex items-start gap-4 p-6">
        {isAuthError ? (
          <KeyRound className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
        )}
        <div>
          <h3 className="font-semibold text-destructive">
            {title || (isAuthError ? "Authentication Required" : "Error")}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          {isAuthError && (
            <div className="mt-3 rounded-md bg-muted p-3">
              <p className="text-xs font-mono text-muted-foreground">
                1. Create a GitHub PAT with &quot;Organization Copilot metrics&quot; (read) permission
                <br />
                2. Copy .env.local.example to .env.local
                <br />
                3. Set GITHUB_TOKEN in .env.local
                <br />
                4. Restart the development server
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
