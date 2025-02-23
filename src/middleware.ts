import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { env } from "./env";

export default auth(async(req: NextRequest) => {
  const url = new URL(req.nextUrl);
  if (url.pathname.includes("/admin/dashboard")) {
    const session = await auth();
    if(!session || session.user.name !== env.ADMIN_NAME) {
      return NextResponse.redirect(`${url.origin}/admin/signin`);
    }
  }
})