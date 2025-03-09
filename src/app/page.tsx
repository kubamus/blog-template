"use client";

import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import styles from "./page.module.scss";

export default function Home() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["getPosts"],
    queryFn: async () => {
      const postList = await client.post.list.$get({ limit: 10, offset: 0 });
      if (postList.status !== 200) {
        return [];
      }
      return await postList.json();
    },
  });
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Posts</h1>
      {isLoading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>Error: {error.message}</p>}
      {data && (
        <ul className={styles.postList}>
          {data.map((post) => (
            <li key={post.id} className={styles.postItem}>
              <Link href={`/post/${post.id}`} className={styles.postLink}>
                <span className={styles.postTitle}>{post.title}</span>
                <span className={styles.postDescription}>{post.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}