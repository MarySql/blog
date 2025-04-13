"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const MarkdownEditor = dynamic(
  () => import("@/components/MarkdownEditor"),
  { ssr: false }
);

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
  createdAt: string;
  updatedAt: string;
  comments: any[] | null;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: ""
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      fetchPosts();
    }
  }, [router]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching posts with token:", token);
      
      const response = await fetch("http://localhost:8080/api/posts", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        
        let errorMessage = "Erro ao carregar posts";
        try {
          const text = await response.text();
          console.log("Error response text:", text);
          if (response.headers.get("content-type")?.includes("application/json")) {
            const errorData = JSON.parse(text);
            errorMessage = errorData.message || errorMessage;
          } else {
            errorMessage = `Erro ${response.status}: ${text.substring(0, 100)}...`;
          }
        } catch (e) {
          console.error("Error parsing error response:", e);
          errorMessage = `Erro ${response.status}: Não foi possível ler a resposta do servidor`;
        }
        
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get("content-type");
      console.log("Content-Type:", contentType);

      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        console.error("Expected JSON but got:", text);
        throw new Error("Resposta do servidor não está no formato JSON");
      }

      const data = await response.json();
      console.log("Parsed data:", data);
      
      if (!Array.isArray(data)) {
        console.error("Invalid data format:", data);
        throw new Error("Formato de dados inválido");
      }

      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      let errorMessage = "Erro ao carregar posts";
      if (err instanceof Error) {
        if (err.message.includes("locale")) {
          errorMessage = "Erro no servidor: Problema com a configuração do banco de dados";
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setIsCreating(true);

    try {
      console.log("Creating post with data:", newPost);
      const response = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(newPost)
      });

      console.log("Create post response status:", response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        throw new Error("Erro ao criar post");
      }

      const createdPost = await response.json();
      console.log("Created post:", createdPost);
      
      setNewPost({ title: "", content: "" });
      await fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err instanceof Error ? err.message : "Erro ao criar post");
    } finally {
      setIsCreating(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
          <p className="font-semibold">Erro ao carregar posts</p>
          <p className="mt-2">{error}</p>
          <p className="mt-2 text-sm">
            Por favor, tente novamente mais tarde ou entre em contato com o administrador.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Tentar fazer login novamente
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Recarregar página
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Posts</h1>
      </div>

      {/* Formulário de criação de post */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Título do post"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <MarkdownEditor
              value={newPost.content}
              onChange={(content) => setNewPost({ ...newPost, content })}
              className="min-h-[150px]"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isCreating}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isCreating ? "Criando..." : "Publicar"}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de posts */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum post encontrado.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="border rounded-md p-6 hover:shadow-md transition-shadow"
            >
              <Link href={`/posts/${post.id}`}>
                <h2 className="text-2xl font-semibold mb-2 hover:text-blue-500">
                  {post.title}
                </h2>
              </Link>
              <div className="text-gray-500 text-sm mb-4">
                Por {post.author?.username || "Usuário desconhecido"} em{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
              <p className="text-gray-700 line-clamp-3">
                {post.content.replace(/<[^>]*>/g, "").substring(0, 200)}...
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 