import { Post } from "@/types/post";

const API_URL = "http://localhost:8080/api";

interface CreatePostData {
  title: string;
  content: string;
  authorId: string;
}

export const postService = {
  async getAllPosts(): Promise<Post[]> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    const response = await fetch(`${API_URL}/posts`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao carregar posts");
    }
    return response.json();
  },

  async getPostById(id: string): Promise<Post> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    const response = await fetch(`${API_URL}/posts/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Post não encontrado");
    }
    return response.json();
  },

  async createPost(data: CreatePostData): Promise<Post> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token não encontrado");
    }

    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar post");
    }

    return response.json();
  },

  async updatePost(id: string, post: Partial<Post>): Promise<Post> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar post");
    }

    return response.json();
  },

  async deletePost(id: string): Promise<void> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Erro ao excluir post";
      
      try {
        const parsedError = JSON.parse(errorText);
        if (parsedError.message) {
          errorMessage = parsedError.message;
        }
      } catch (e) {
        // Se não for JSON, use o texto do erro
        errorMessage = errorText;
      }

      if (response.status === 401) {
        // Token inválido ou expirado
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        throw new Error("Sua sessão expirou. Por favor, faça login novamente.");
      }

      throw new Error(errorMessage);
    }
  },
}; 