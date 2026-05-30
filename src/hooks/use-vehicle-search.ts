import { useState, useCallback, useEffect } from "react";

export type VehicleData = Record<string, unknown>;

const HISTORY_KEY = "vehicle_search_history";

export function useVehicleSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VehicleData | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored) as string[]);
    } catch {
      // ignore
    }
  }, []);

  const addToHistory = useCallback((query: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((q) => q !== query);
      const next = [query, ...filtered].slice(0, 5);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const search = useCallback(
    async (registrationNumber: string) => {
      if (!registrationNumber.trim()) return;
      const query = registrationNumber.trim().toUpperCase();
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const res = await fetch(`/api/info?vehicle=${encodeURIComponent(query)}`);
        const json = (await res.json()) as VehicleData;

        if (!res.ok) {
          throw new Error(
            typeof json["error"] === "string"
              ? json["error"]
              : `Request failed (${res.status})`
          );
        }

        if (json["status"] === false) {
          throw new Error(
            typeof json["message"] === "string"
              ? json["message"]
              : "No data found for this vehicle number"
          );
        }

        setData(json);
        addToHistory(query);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      } finally {
        setLoading(false);
      }
    },
    [addToHistory]
  );

  return { search, loading, error, data, history };
}
