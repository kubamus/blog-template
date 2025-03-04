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

        if (limit > 25) {
          throw new HTTPException(400, { message: "Limit cannot exceed 25" });
        }

        const { db } = ctx;
        const postList = await db.posts.findMany({ orderBy: { createdAt: "desc" }, take: limit, skip: offset });
        return c.json(postList);
      } catch (error) {
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
        const post = await db.posts.create({ data: {
          title: input.title,
          description: input.description,
          content: input.content,
        } })
        
        return c.json(post);
      } catch (error) {
        if (error instanceof ZodError) {
          throw new HTTPException(400, { message: "Invalid input parameters" });
        }
        throw new HTTPException(500, { message: "Internal Server Error" });
      }
    }
  ),
  get: publicProcedure
    .input(
      z.object({
        id: z.number().positive(),
      })
    )
    .get(async ({ ctx, c, input }) => {
      try {
        const { db } = ctx;
        const post = await db.posts.findUnique({ where: { id: input.id } })

        if (post === null) {
          throw new HTTPException(404, { message: "Post not found" });
        }

        return c.json(post);
      } catch {
        throw new HTTPException(500, { message: "Internal Server Error" });
      }
    }),
});
