"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { api } from "~/trpc/react";

export function UrlShortener() {
  const [latestUrl] = api.url.getLatest.useSuspenseQuery();
  const [copyStatus, setCopyStatus] = useState(""); // For copy feedback
  const [baseUrl, setBaseUrl] = useState(""); // Store the base URL
  const pathname = usePathname();

  const utils = api.useUtils();
  const [longUrl, setLongUrl] = useState("");
  const createUrl = api.url.create.useMutation({
    onSuccess: async () => {
      await utils.url.invalidate();
      setLongUrl("");
    },
  });
  
  // Reset copy status after 2 seconds
  useEffect(() => {
    if (copyStatus) {
      const timer = setTimeout(() => {
        setCopyStatus("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copyStatus]);

  // Set base URL on client side
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  return (
    <div className="w-full max-w-xs">
      {latestUrl ? (
        <div className="mb-6">
          <p className="mb-4">
            Success! Here is your shortened URL:
          </p>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-grow overflow-hidden">
              <a 
                href={`/${latestUrl.url_hash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-300 hover:underline truncate block"
              >
                {baseUrl}/{latestUrl.url_hash}
              </a>
            </div>
            
            <button 
              onClick={() => {
                const shortUrl = `${baseUrl}/${latestUrl.url_hash}`;
                navigator.clipboard.writeText(shortUrl)
                  .then(() => {
                    setCopyStatus("copied");
                  })
                  .catch(() => {
                    setCopyStatus("error");
                  });
              }} 
              type="button" 
              className={`rounded-full px-4 py-2 font-semibold text-sm transition flex-shrink-0 ${copyStatus === "copied" ? "bg-green-600/50 hover:bg-green-600/70" : copyStatus === "error" ? "bg-red-600/50 hover:bg-red-600/70" : "bg-white/10 hover:bg-white/20"}`}
            >
              {copyStatus === "copied" ? "Copied!" : copyStatus === "error" ? "Failed!" : "Copy"}
            </button>
          </div>
        </div>
        
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
          {createUrl.isPending ? "Shortening..." : "Shorten"}
        </button>
      </form>
    </div>
  );
}
