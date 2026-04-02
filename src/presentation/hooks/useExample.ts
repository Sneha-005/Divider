/**
 * Example Custom Hook
 * Place all your custom hooks in presentation/hooks/
 */

import { useEffect, useState } from "react";

export function useExample() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize your hook logic here
  }, []);

  return { data, loading, error };
}
