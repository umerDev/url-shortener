"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function GetAllUrls() {
  const [cursorStack, setCursorStack] = useState<number[]>([]);
  const currentCursor = cursorStack[cursorStack.length - 1];

  const { data, isLoading, isFetching } = api.url.getAll.useQuery({
    limit: 5,
    cursor: currentCursor,
  });

  const handleNext = () => {
    if (data?.nextCursor) {
      setCursorStack((prev) => [...prev, data.nextCursor!]);
    }
  };

  const handlePrevious = () => {
    if (cursorStack.length > 1) {
      setCursorStack((prev) => prev.slice(0, -1));
    } else {
      setCursorStack([]);
    }
  };

  return (
    <div className="mw-full w-[300px] rounded-md border bg-gray-100 p-4">
      <h2 className="mb-4 text-2xl font-bold text-blue-600">All URLs</h2>

      <div className="h-[220px] overflow-y-auto rounded-md border bg-white p-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-2">
            {data?.items?.map((url) => (
              <li
                key={url.id}
                className="truncate text-blue-600 hover:underline"
                title={url.url}
              >
                <a href={url.url} target="_blank" rel="noopener noreferrer">
                  {url.url}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={cursorStack.length === 0}
          className="rounded bg-red-800 px-4 py-2 disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!data?.nextCursor || isFetching}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
