"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";

const useDebounce = (fn: (...args: any[]) => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  return (...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fnRef.current(...args);
    }, delay);
  };
};

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    term ? params.set("query", term) : params.delete("query");
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearchCategory = (category: string) => {
    const params = new URLSearchParams(searchParams);
    category !== "all" ? params.set("category", category) : params.delete("category");
    replace(`${pathname}?${params.toString()}`);
  };

  const debouncedHandleSearch = useDebounce(handleSearch, 300);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    handleSearchCategory(category);
  };

  return (
    <>
      <div className="relative flex flex-1 flex-shrink-0">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder={placeholder}
          onChange={(e) => debouncedHandleSearch(e.target.value)}
          defaultValue={searchParams.get("query")?.toString()}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
      <select value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
        <option value="all">All</option>
        <option value="books">Books</option>
        <option value="movies">Movies</option>
      </select>
    </>
  );
}
