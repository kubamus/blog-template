import { jstack } from "jstack"
import { drizzle } from "drizzle-orm/postgres-js"
import { env as envAdapter } from "hono/adapter"
import { auth } from "@/lib/auth"
import { env } from "@/env"
import { HTTPException } from "hono/http-exception"

export const j = jstack.init<{
  Bindings: { DATABASE_URL: string }
}>()

/**
 * Type-safely injects database into all procedures
 * @see https://jstack.app/docs/backend/middleware
 * 
 * For deployment to Cloudflare Workers
 * @see https://developers.cloudflare.com/workers/tutorials/postgres/
 */
const databaseMiddleware = j.middleware(async ({ c, next }) => {
  const { DATABASE_URL } = envAdapter(c)

  const db = drizzle(DATABASE_URL)

  return await next({ db })
})

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = j.procedure.use(databaseMiddleware)

export const adminProcedure = j.procedure.use(databaseMiddleware).use(async ({ c, next }) => {
  const session = await auth();
  if(!session || session.user?.name !== env.ADMIN_NAME) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  await next({ isAdmin: true })
});