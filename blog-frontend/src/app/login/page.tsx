"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

interface ValidationErrors {
  username?: string;
  password?: string;
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!username) {
      errors.username = "Nome de usuário obrigatório";
    }

    if (!password) {
      errors.password = "Senha obrigatória";
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
      await login(username.trim(), password.trim());
    } catch (err) {
      console.error("Erro detalhado no login:", err);
      setError("Usuário ou senha incorretos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
        
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
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-blue-500 hover:text-blue-600 font-medium">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
}