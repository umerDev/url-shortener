"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function UrlShortener() {
  const [latestUrl] = api.url.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [longUrl, setLongUrl] = useState("");
  const createUrl = api.url.create.useMutation({
    onSuccess: async () => {
      await utils.url.invalidate();
      setLongUrl("");
    },
  });

  return (
    <div className="w-full max-w-xs">
      {latestUrl ? (
        <p className="truncate mb-4">
          Success! Here is your shortened URL: <br />
          <a 
            href={latestUrl.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-300 hover:underline"
          >
            {window.location.origin}/{latestUrl.url_hash}
          </a>
        </p>
      ) : (
        <p className="mb-4">You haven't shortened any URLs yet.</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createUrl.mutate({ url: longUrl });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="url"
          placeholder="Enter a URL to shorten"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-white"
          required
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createUrl.isPending}
        >
          {createUrl.isPending ? "Shortening..." : "Shorten URL"}
        </button>
      </form>
    </div>
  );
}
