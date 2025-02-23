import { client } from "@/lib/client";
import { Post } from "@/server/db/schema";
import { redirect } from "next/navigation";
import styles from "./page.module.scss";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface Params {
  id: string;
}

const getPost = async (id: number): Promise<Post | null> => {
  const post = await client.post.get.$get({ id });
  if (post.status === 200) {
    return await post.json();
  } else {
    return null;
  }
};


export default async function PostPage({
  params: urlParams,
}: {
  params: Params;
}) {
  const params = await urlParams;
  const id = parseInt(params.id);
  if (isNaN(id)) {
    redirect("/");
  }
  const post = await getPost(id);
  if (!post) {
    redirect("/");
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/" className={styles.goBackButton}>Back</Link>
        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.description}>{post.description}</p>
        <div>
          <ReactMarkdown children={post.content} />
        </div>
      </div>
    </main>
  );
}