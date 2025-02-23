"use client";

import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import styles from "./page.module.scss";
import { Post } from "@/server/db/schema";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const router = useRouter();
  const [content, setContent] = useState("# Start editing your post here");
  const { mutate: createPost, isPending } = useMutation({
    mutationKey: ["createPost"],
    mutationFn: async (data: {
      title: string;
      description: string;
      content: string;
    }): Promise<Post> => {
      const response = await client.post.create.$post(data);
      if (response.status === 200) {
        const post: Post = await response.json();
        return post;
      }
      throw new Error("Failed to create post");
    },
    onSuccess: (post) => {
      router.push(`/post/${post.id}`);
    },
    onError: (error) => {
      console.log(error)
      alert("Failed to create post");
    }
  });

  return (
    <main className={styles.main}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const title = formData.get("title") as string;
          const description = formData.get("description") as string;
          createPost({
            title,
            description,
            content,
          });
        }}
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          className={styles.input}
        />
        <textarea
          name="description"
          placeholder="Description"
          className={styles.textarea}
        />
        <div className={styles.mdEditorContainer}>
          <MDEditor
            value={content}
            onChange={(value) => setContent(value || "")}
            height={400}
            className={styles.mdEditor}
            data-color-mode="light"
          />
        </div>
        <button type="submit" className={styles.button} disabled={isPending}>
          Create Post
        </button>
      </form>
    </main>
  );
}