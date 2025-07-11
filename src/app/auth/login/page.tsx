"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(8),
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

    const formData = new FormData();
    formData.append("email", inputData.email);
    formData.append("passwrod", inputData.password);

    try {
      //     const result = signIn(formData);
      //   if (result?.error) {
      //     setError(result.error);
      //   }
      //   return;
    } catch {
      setError("Unexpected error has occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="">Email Address</label>
              <input
                {...register("email")}
                type="email"
                id="email"
                placeholder="Enter email here..."
              />
              {errors.email && (
                <div className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="">Password</label>
              <input
                {...register("password")}
                type="password"
                id="password"
                placeholder="Enter password here..."
              />
              {errors.password && (
                <div className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </div>
              )}
            </div>
          </div>
          <button
            disabled={isLoading || !isValid}
            className="w-full flex justify-center py-3 cursor-pointer px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
