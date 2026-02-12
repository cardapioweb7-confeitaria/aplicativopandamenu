"use client";

import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
      <div className="text-center p-6">
        <h1 className="text-3xl font-bold mb-4">Página de Login</h1>
        <p className="mb-8 text-gray-600">Esta é uma página de login de exemplo para demonstração.</p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Ir para a Home (Simular Login)
        </Link>
      </div>
    </div>
  );
}