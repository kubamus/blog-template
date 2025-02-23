"use client";

import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";

export default function CreatePost() {
  const { mutate: createPost, isPending } = useMutation({
    mutationKey: ["createPost"],
    mutationFn: async (data: {
      title: string;
      description: string;
      content: string;
    }) => {
      const response = await client.post.create.$post(data);
      if (response.status === 200) {
        return await response.json();
      }
      return null;
    },
  });
  return <main>
    <form onSubmit={(e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const content = formData.get("content") as string;
      createPost({
        title,
        description,
        content,
      });
    }
    }>
      <input type="text" name="title" placeholder="Title" />
      <textarea name="description" placeholder="Description"></textarea>
      <textarea name="content" placeholder="Content"></textarea>
      <button type="submit">Create Post</button>
    </form>
  </main>;
}
