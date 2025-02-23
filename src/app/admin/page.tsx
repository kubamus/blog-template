import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Admin() {
  const session = await auth();
  if(!session) return redirect("/admin/signin");
  redirect("/admin/dashboard");
}