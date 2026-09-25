import { useState, useEffect } from 'react';

export interface UkRegion {
  name: string;
  code: string;
  cities: string[];
}

let cachedRegions: UkRegion[] | null = null;

export function useUkLocations() {
  const [regions, setRegions] = useState<UkRegion[]>(cachedRegions || []);
  const [isLoading, setIsLoading] = useState<boolean>(!cachedRegions);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedRegions) {
      setRegions(cachedRegions);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    fetch('/api/locations/uk')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load UK locations');
        return res.json();
      })
      .then((data) => {
        if (isMounted && data?.regions) {
          cachedRegions = data.regions;
          setRegions(data.regions);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Error fetching UK locations');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { regions, isLoading, error };
}
