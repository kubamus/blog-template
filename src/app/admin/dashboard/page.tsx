import { auth } from "@/lib/auth";
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await auth();
  return <div>Admin Dashboard
    {JSON.stringify(session)}
    <Link href="/admin/dashboard/create">Write post...</Link>
  </div>;
};
