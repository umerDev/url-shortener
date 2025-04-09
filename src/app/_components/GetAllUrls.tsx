"use client";

import { useState, useEffect } from "react";

import { api } from "~/trpc/react";

export function GetAllUrls() {
  const [urls] = api.url.getAll.useSuspenseQuery();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All URLs</h2>
      <ul>
        {urls.map((url) => (
          <li key={url.id}>
            <a href={url.url} target="_blank" rel="noopener noreferrer">
              {url.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}