"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  // const checkAuth = async () => {
  //   try {
  //     const response = await axios("/api/auth/");
  //     if (response) {
  //       setUser(response.data.user);
  //     }
  //   } catch (error) {
  //     console.error("Auth check failed", error);
  //   } finally {
  //     setAuthLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">Recipe AI</h1>
          <p className="text-lg text-gray-700 max-w-xl mx-auto">
            Discover personalized recipes, plan your meals, and cook with
            AI-powered guidance. Your intelligent cooking companion awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a
              href="/auth/register"
              className="px-8 py-3 bg-black text-white rounded-md"
            >
              Get Started
            </a>
            <a
              href="/auth/login"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center bg-sky-600">
        <Cookie className="text-white w-32 h-32" />
      </div>
    </div>
  );
}
