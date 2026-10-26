import { useEffect, useState } from "react";
import { api, errorMessage } from "./api";

// Associate responses with their request so navigation never displays stale data.
export function useApi<T>(path: string, version = "") {
  const [revision, setRevision] = useState(0);
  const key = JSON.stringify([path, version, revision]);
  const [result, setResult] = useState<{
    key: string;
    data: T | null;
    error: string;
  } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    api<T>(path, "GET", undefined, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult({ key, data, error: "" });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setResult({ key, data: null, error: errorMessage(error) });
      });
    return () => controller.abort();
  }, [path, key]);
  const current = result?.key === key ? result : null;
  return {
    data: current?.data ?? null,
    error: current?.error ?? "",
    loading: current === null,
    retry: () => setRevision((value) => value + 1),
  };
}
