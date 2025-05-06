"use client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

export function UrlShortener() {
  const [longUrl, setLongUrl] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [baseUrl, setBaseUrl] = useState("");

  const [latestUrl] = api.url.getLatest.useSuspenseQuery();
  const utils = api.useUtils();
  const createUrl = api.url.create.useMutation({
    onSuccess: async () => {
      await utils.url.invalidate();
      setLongUrl("");
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (!copyStatus) return;

    const timer = setTimeout(() => {
      setCopyStatus("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [copyStatus]);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    createUrl.mutate({ url: longUrl });
  };

  const handleCopy = () => {
    const shortUrl = `${baseUrl}/${latestUrl?.url_hash}`;
    navigator.clipboard
      .writeText(shortUrl)
      .then(() => setCopyStatus("copied"))
      .catch(() => setCopyStatus("error"));
  };

  const CopyButton = () => (
    <button
      onClick={handleCopy}
      type="button"
      className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
        copyStatus === "copied"
          ? "bg-green-600/50 hover:bg-green-600/70"
          : copyStatus === "error"
            ? "bg-red-600/50 hover:bg-red-600/70"
            : "bg-white/10 hover:bg-white/20"
      }`}
    >
      {copyStatus === "copied"
        ? "Copied!"
        : copyStatus === "error"
          ? "Failed!"
          : "Copy"}
    </button>
  );

  const ShortUrlDisplay = () => (
    <div className="mb-6">
      <p className="mb-4">Success! Here is your shortened URL:</p>

      <div className="mb-4 flex items-center gap-2">
        <div className="flex-grow overflow-hidden">
          <a
            href={`/${latestUrl?.url_hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-blue-300 hover:underline"
          >
            {baseUrl}/{latestUrl?.url_hash}
          </a>
        </div>
        <CopyButton />
      </div>
    </div>
  );

  const UrlForm = () => (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
  );

  return (
    <div className="w-full max-w-xs">
      {latestUrl ? (
        <ShortUrlDisplay />
      ) : (
        <p className="mb-4">You haven't shortened any URLs yet.</p>
      )}
      <UrlForm />
    </div>
  );
}
