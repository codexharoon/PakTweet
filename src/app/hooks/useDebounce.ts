import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, dealy: number = 250): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, dealy);

    return () => {
      clearTimeout(handler);
    };
  }, [value, dealy]);

  return debouncedValue;
}
