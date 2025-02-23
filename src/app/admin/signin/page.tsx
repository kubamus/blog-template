"use client";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import styles from "./page.module.scss";

export default function SignIn() {
  const [errorMsg, setErrorMsg] = useState("");

  const session = useSession();
  if(session.status === "authenticated") {
    redirect("/admin/dashboard");
  }

  if(session.status === "loading") return;

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(""); // reset any previous error
    const target = e.target as typeof e.target & {
      name: { value: string };
      password: { value: string };
    };
    const name = target.name.value;
    const password = target.password.value;
    const response = await signIn("credentials", { name, password, redirect: false });
    if (response?.status === 200 && response.error === null) {
      redirect("/admin/dashboard");
    } else {
      let message = "";
      switch (response?.code) {
        case "rate_limit":
          message = "Too many attempts";
          break;
        case "invalid_credentials":
          message = "Invalid credentials";
          break;
        case "validation_error":
          message = "Validation error";
          break;
        default:
          message = "An error occurred";
          break;
      }
      setErrorMsg(message);
    }
  };
  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={login}>
        <h1 className={styles.title}>Sign In</h1>
        <p className={styles.subtitle}>Sign in to access the admin dashboard</p>
        <input
          className={styles.input}
          type="text"
          name="name"
          id="name"
          placeholder="Name..."
        />
        <input
          className={styles.input}
          type="password"
          name="password"
          id="password"
          placeholder="Password..."
        />
        <button className={styles.button}>Submit</button>
        {errorMsg && <div className={styles.errorBox}>{errorMsg}</div>}
      </form>
    </main>
  );
}