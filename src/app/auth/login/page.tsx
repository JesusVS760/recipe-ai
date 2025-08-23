"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { signIn } from "@/lib/auth-actions.";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { Cookie } from "lucide-react";

const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Please enter valid password"),
});

type LoginFromData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  async function onSubmit(inputData: LoginFromData) {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", inputData.email);
    formData.append("password", inputData.password);

    try {
      const result = await signIn(formData);
      if (result?.success) {
        sessionStorage.setItem("firstName", result.firstName as string);
        toast("Successfully logged in ✅!");
        window.location.href = "/dashboard";
      }
      if (result?.error) {
        setError(result.error);
      }
    } catch {
      setError("Unexpected error has occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex items-center justify-center bg-sky-600">
        <Cookie className="text-white w-32 h-32" />
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md lg:max-w-xl space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Login 🔒
          </h1>
          <p className="text-md text-gray-700 text-center">
            Welcome back! Sign in to access your personalized recipes, meal
            plans, and AI-powered cooking assistant.
          </p>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Email Address</label>
              <input
                {...register("email")}
                type="email"
                id="email"
                placeholder="john.doe@example.com"
                className="py-2 px-4 w-full rounded-sm shadow-md outline"
              />
              {errors.email && (
                <div className="text-sm text-red-600">
                  {errors.email.message}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold">Password</label>
              <input
                {...register("password")}
                type="password"
                id="password"
                placeholder="Enter password here..."
                className="py-2 px-4 w-full rounded-sm shadow-md outline"
              />
              {errors.password && (
                <div className="text-sm text-red-600">
                  {errors.password.message}
                </div>
              )}
            </div>

            <button
              disabled={isLoading || !isValid}
              className="w-full flex justify-center py-3 px-4 border border-transparent bg-black rounded-lg shadow-sm text-sm font-medium text-white hover:bg-gray-800 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                "Login"
              )}
            </button>

            <Toaster />
            <div className="text-center">
              <Link href="/auth/forgot">
                <p className="pt-2 ">Forgot Password?</p>
              </Link>
              <Link href="/auth/register">
                <p className="pt-2">Create an account.</p>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
