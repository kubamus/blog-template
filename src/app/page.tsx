"use client";

import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["getPosts"],
    queryFn: async() => {
      const postList = await client.post.list.$get({ limit: 10, offset: 0 });
      if(postList.status !== 200) {
        console.error("Error fetching posts")
        return [];
      }
      return await postList.json();
    }
  });
return <main>
    <h1>Posts</h1>
    {isLoading && <p>Loading...</p>}
    {error && <p>Error: {error.message}</p>}
    {data && (
      <ul>
        {data.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    )}
  </main>
};
