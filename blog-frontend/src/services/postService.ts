import { Post } from "@/types/post";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const postService = {
  async getAllPosts(): Promise<Post[]> {
    const response = await fetch(`${API_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar posts");
    }

    return response.json();
  },

  async getPostById(id: string): Promise<Post> {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar post");
    }

    return response.json();
  },

  async createPost(post: Omit<Post, "id" | "authorId" | "createdAt" | "updatedAt">): Promise<Post> {
    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar post");
    }

    return response.json();
  },

  async updatePost(id: string, post: Partial<Post>): Promise<Post> {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar post");
    }

    return response.json();
  },

  async deletePost(id: string, authorId: string): Promise<void> {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ authorId }),
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar post");
    }
  },
}; 