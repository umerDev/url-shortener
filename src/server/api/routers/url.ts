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
      // Generate a unique hash for the URL
      const url_hash = Math.random().toString(36).substring(2, 8);
      
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

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.uRL.findMany();
  }),
});
