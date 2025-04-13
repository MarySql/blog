"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="bg-gray-900 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={() => router.push("/posts")}
                className="text-xl font-bold text-purple-400 hover:text-purple-300 transition-colors duration-200"
              >
                Blogeek
              </button>
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <button
                onClick={logout}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
              >
                Sair
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}