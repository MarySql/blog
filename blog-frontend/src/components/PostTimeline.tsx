import { useState } from "react";
import { Post } from "@/types/post";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface PostTimelineProps {
  posts: Post[];
}

export default function PostTimeline({ posts }: PostTimelineProps) {
  const router = useRouter();
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [showActions, setShowActions] = useState<Set<string>>(new Set());

  const toggleExpand = (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  const toggleActions = (postId: string) => {
    const newShowActions = new Set(showActions);
    if (newShowActions.has(postId)) {
      newShowActions.delete(postId);
    } else {
      newShowActions.add(postId);
    }
    setShowActions(newShowActions);
  };

  const isContentLong = (content: string) => {
    return content.length > 500;
  };

  const truncateContent = (content: string) => {
    return content.length > 500 ? content.substring(0, 500) + "..." : content;
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {post.authorId.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {post.authorId} • {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => toggleActions(post.id)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                    {showActions.has(post.id) && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <button
                          onClick={() => {
                            router.push(`/posts/${post.id}/edit`);
                            setShowActions(new Set());
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Editar post
                        </button>
                        <button
                          onClick={() => {
                            router.push(`/posts/${post.id}`);
                            setShowActions(new Set());
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Ver detalhes
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 prose max-w-none">
                  <ReactMarkdown>
                    {expandedPosts.has(post.id) || !isContentLong(post.content)
                      ? post.content
                      : truncateContent(post.content)}
                  </ReactMarkdown>
                </div>
                {isContentLong(post.content) && (
                  <button
                    onClick={() => toggleExpand(post.id)}
                    className="mt-2 text-blue-500 hover:text-blue-600"
                  >
                    {expandedPosts.has(post.id) ? "Mostrar menos" : "Ler mais"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 