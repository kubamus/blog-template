import { jstack } from "jstack"
import { auth } from "@/lib/auth"
import { env } from "@/env"
import { db } from "@/server/db"
import { HTTPException } from "hono/http-exception"

export const j = jstack.init<{
  Bindings: { DATABASE_URL: string }
}>()

/**
 * Type-safely injects database into all procedures
 * @see https://jstack.app/docs/backend/middleware
 * 
 */
const databaseMiddleware = j.middleware(async ({ next }) => {
  return await next({ db })
})

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = j.procedure.use(databaseMiddleware)


/**
 * Admin procedures
 */
export const adminProcedure = j.procedure.use(databaseMiddleware).use(async ({ next }) => {
  const session = await auth();
  if(!session || session.user?.name !== env.ADMIN_NAME) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  await next({ isAdmin: true })
});