import { redirect } from "next/navigation";
import { db } from "~/server/db";

export default async function ShortUrlRedirect({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const resolvedParams = await params;
  const { hash } = resolvedParams;

  const url = await db.uRL.findUnique({
    where: {
      url_hash: hash,
    },
  });

  if (url) {
    const targetUrl = url.url.startsWith("http://") || url.url.startsWith("https://") 
      ? url.url 
      : `https://${url.url}`;
    
    redirect(targetUrl);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          URL Not Found
        </h1>
        <p className="text-2xl">
          The shortened URL you are looking for does not exist.
        </p>
      </div>
    </div>
  );
}
