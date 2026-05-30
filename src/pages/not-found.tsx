import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background dark">
      <div className="w-full max-w-md mx-4 p-8 rounded-xl border border-border bg-card text-card-foreground">
        <div className="flex mb-4 gap-3 items-center">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <h1 className="text-2xl font-bold text-white">404 — Not Found</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          This page does not exist. Go back to the{" "}
          <a href="/" className="text-primary underline">home page</a>.
        </p>
      </div>
    </div>
  );
}
