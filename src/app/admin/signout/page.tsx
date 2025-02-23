"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import styles from "./page.module.scss";

export default function SignOut() {
  const router = useRouter();
  const session = useSession();

  if(session.status === "unauthenticated") {
    redirect("/admin/signin");
  }

  if(session.status === "loading") return;

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/admin/signin");
  };

  return (
    <main className={styles.container}>
      <div className={styles.form}>
        <h1 className={styles.title}>Sign Out</h1>
        <p className={styles.subtitle}>Click the button below to sign out from your account.</p>
        <button onClick={handleSignOut} className={styles.button}>Sign Out</button>
      </div>
    </main>
  );
}