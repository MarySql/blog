"use client";

import Link from "next/link";
import { useAuth } from "~/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Blog
        </Link>
        <div className="space-x-4">
          <Link href="/posts">Posts</Link>
          {user ? (
            <>
              <Link href="/posts/new">Novo Post</Link>
              <button onClick={logout} className="hover:underline">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Registrar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}