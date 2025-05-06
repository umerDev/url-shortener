import { randomBytes } from "crypto";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const urlRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      const url_hash = randomBytes(6).toString("base64").substring(0, 8);

      return ctx.db.uRL.create({
        data: {
          url: input.url,
          url_hash: url_hash,
        },
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const url = await ctx.db.uRL.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return url ?? null;
  }),

  getAll: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).optional().default(10),
          cursor: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 10;
      const cursor = input?.cursor;

      const items = await ctx.db.uRL.findMany({
        take: limit + 1,
        orderBy: { id: "asc" },
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : 0,
      });

      const hasNextPage = items.length > limit;
      const results = hasNextPage ? items.slice(0, -1) : items;

      return {
        items: results,
        nextCursor: hasNextPage ? results[results?.length - 1]?.id : null,
      };
    }),
});
