"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log("Tentando fazer login com:", username);
      
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Resposta do login:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro no login:", errorText);
        
        // Se a resposta não for JSON, use o texto como mensagem de erro
        let errorMessage = errorText;
        try {
          const parsedError = JSON.parse(errorText);
          if (parsedError.message) {
            errorMessage = parsedError.message;
          }
        } catch (e) {
          // Se não for JSON, já temos a mensagem de erro no errorText
          console.log("Resposta de erro não é JSON, usando texto direto");
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Dados do login:", data);
      
      if (!data.token) {
        throw new Error("Token não recebido do servidor");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      router.push("/posts");
    } catch (error) {
      console.error('Erro detalhado no login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const createAccount = async (username: string, password: string, email: string) => {
    try {
      console.log("Tentando criar conta para:", username);
      
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password, email }),
      });

      console.log("Resposta do registro:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro no registro:", errorText);
        
        // Se a resposta não for JSON, use o texto como mensagem de erro
        let errorMessage = errorText;
        try {
          const parsedError = JSON.parse(errorText);
          if (parsedError.message) {
            errorMessage = parsedError.message;
          }
        } catch (e) {
          // Se não for JSON, já temos a mensagem de erro no errorText
          console.log("Resposta de erro não é JSON, usando texto direto");
        }
        
        throw new Error(errorMessage);
      }

      // Após criar a conta, fazer login automaticamente
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      router.push("/posts");
    } catch (error) {
      console.error('Erro detalhado ao criar conta:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, createAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}