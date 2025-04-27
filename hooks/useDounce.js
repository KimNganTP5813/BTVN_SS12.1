import React, { useEffect, useState } from "react";

export default function useDounce(inputValue, delay) {
  const [debounceSearch, setDebounceSearch] = useState(inputValue);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebounceSearch(inputValue);
    }, delay);

    //Clean up function
    return () => clearTimeout(timerId);
  }, [inputValue, delay]);

  return debounceSearch;
}
