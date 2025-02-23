import { auth } from "@/lib/auth";

export default async function AdminDashboard() {
  const session = await auth();
  return <div>Admin Dashboard
    {JSON.stringify(session)}
  </div>;
};
