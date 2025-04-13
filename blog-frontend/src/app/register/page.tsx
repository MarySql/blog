"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
}

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!username) {
      errors.username = "Nome do usuário obrigatório";
    } else if (username.length < 3 || username.length > 20) {
      errors.username = "O nome precisa ter entre 3 e 20 caracteres";
    }

    if (!email) {
      errors.email = "Email obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Email precisa ser válido";
    }

    if (!password) {
      errors.password = "Senha obrigatória";
    } else if (password.length < 6) {
      errors.password = "A senha precisa ter no mínimo 6 caracteres";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log("Enviando dados para registro:", { username, email });
      
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ username, email, password }),
      });

      console.log("Resposta recebida:", response.status);

      const data = await response.text();
      console.log("Dados da resposta:", data);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(data);
          let errorMessage = "Erro ao criar conta";
          
          if (response.status === 400) {
            errorMessage = "Dados inválidos. Verifique se todos os campos estão corretos.";
          } else if (response.status === 409) {
            errorMessage = "Usuário ou email já cadastrado.";
          } else if (response.status === 500) {
            errorMessage = "Erro interno do servidor. Por favor, tente novamente mais tarde.";
          } else if (response.status === 503) {
            errorMessage = "Serviço temporariamente indisponível. Verifique se o banco de dados está online.";
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
          
          throw new Error(errorMessage);
        } catch (parseError) {
          console.error("Erro ao parsear resposta:", parseError);
          throw new Error(`Erro ao criar conta (Status: ${response.status}). Por favor, tente novamente.`);
        }
      }

      router.push("/login");
    } catch (err) {
      console.error("Erro detalhado no registro:", err);
      setError(err instanceof Error ? err.message : "Erro ao criar conta. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Criar Conta</h1>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Nome de usuário
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setValidationErrors((prev) => ({ ...prev, username: undefined }));
              }}
              className={`w-full px-4 py-3 rounded-md border ${
                validationErrors.username ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={isLoading}
              required
            />
            {validationErrors.username && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationErrors((prev) => ({ ...prev, email: undefined }));
              }}
              className={`w-full px-4 py-3 rounded-md border ${
                validationErrors.email ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={isLoading}
              required
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setValidationErrors((prev) => ({ ...prev, password: undefined }));
              }}
              className={`w-full px-4 py-3 rounded-md border ${
                validationErrors.password ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={isLoading}
              required
            />
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}