import Link from "next/link";

import { UrlShortener } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const hello = await api.url.hello({ text: "from URL Shortener" });

  void api.url.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            URL Shortener
          </h1>
     
        

          <UrlShortener />
        </div>
      </main>
    </HydrateClient>
  );
}
