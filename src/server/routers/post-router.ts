import { posts } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import { z, ZodError } from "zod";
import { adminProcedure, j, publicProcedure } from "../jstack";
import { HTTPException } from "hono/http-exception";

export const postRouter = j.router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().nonnegative().max(25).optional().default(10),
        offset: z.number().nonnegative().optional().default(0),
      }).default({ limit: 10, offset: 0 })
    )
    .get(async ({ ctx, c, input }) => {
      try {
        // If input is missing, the Zod schema will throw an error automatically.
        const { limit, offset } = input;

        console.log(limit)

        if (limit > 25) {
          throw new HTTPException(400, { message: "Limit cannot exceed 25" });
        }

        const { db } = ctx;
        const postList = await db
          .select({
            id: posts.id,
            title: posts.title,
            description: posts.description,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
          })
          .from(posts)
          .orderBy(desc(posts.createdAt))
          .limit(limit)
          .offset(offset);
        return c.json(postList);
      } catch (error) {
        console.log("hi")
        if (error instanceof HTTPException) {
          throw error;
        }
        // Handle ZodError validation errors
        if (error instanceof ZodError) {
          throw new HTTPException(400, { message: "Invalid input parameters" });
        }
        throw new HTTPException(500, { message: "Internal Server Error" });
      }
    }),
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(3).max(80),
        description: z.string().min(3).max(100),
        content: z.string().min(3),
      })
    )
    .post(async ({ ctx, c, input }) => {
      try {
        const { db } = ctx;
        const post = await db.insert(posts).values({
          title: input.title,
          description: input.description,
          content: input.content,
        }).returning();
        
        return c.json(post[0]);
      } catch (error) {
        if (error instanceof ZodError) {
          throw new HTTPException(400, { message: "Invalid input parameters" });
        }
        throw new HTTPException(500, { message: "Internal Server Error" });
      }
    }
  ),
});
