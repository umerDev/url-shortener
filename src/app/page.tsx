import Link from "next/link";

import { UrlShortener } from "~/app/_components/UrlShortener";
import {GetAllUrls } from "~/app/_components/GetAllUrls";

import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  void api.url.getLatest.prefetch();
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            URL Shortener
          </h1>
          <UrlShortener />
          <GetAllUrls />
        </div>
      </main>
    </HydrateClient>
  );
}
