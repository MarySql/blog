"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Blog App</h1>
        
        <div className="space-y-4">
          <Link 
            href="/login" 
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center font-medium"
          >
            Entrar
          </Link>
          
          <Link 
            href="/register" 
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center font-medium"
          >
            Criar uma conta
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Faça login ou crie uma conta para começar a postar
        </p>
      </div>
    </div>
  );
}