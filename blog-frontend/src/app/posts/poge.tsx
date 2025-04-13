import { getPosts } from "~/lib/api";
import MarkdownViewer from "~/components/MarkdownViewer";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
}

export default async function Posts() {
  const response = await getPosts();
  const posts: Post[] = response.data;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link href="/posts/new" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Novo Post
        </Link>
      </div>
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <MarkdownViewer content={post.content} />
          </div>
        ))}
      </div>
    </div>
  );
}