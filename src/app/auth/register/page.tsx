"use client";

import { signUp } from "@/lib/auth-actions.";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const signUpSchema = z.object({
  firstname: z.string().min(2).max(12),
  lastname: z.string().min(2).max(12),
  email: z.email(),
  password: z.string().min(8),
});

type SignUpFromData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  async function onSubmit(data: SignUpFromData) {
    setIsLoading(true);
    setError(null);
    const formdata = new FormData();
    formdata.append("firstname", data.firstname);
    formdata.append("email", data.email);
    formdata.append("lastname", data.lastname);
    formdata.append("password", data.password);

    try {
      const result = await signUp(formdata);
      if (result?.error) {
        console.log(result.error);
        setError("Failed to Sign Up!");
      }
      if (result?.success) {
        console.log("reached; result: ", result);
        sessionStorage.setItem("firstName", result.firstName as string);
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Unexpected error has occurred");
    } finally {
      setIsLoading(true);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-sky-600">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-10 gap-2">
          <label className="font-bold text-black text-2xl"> ✍️ Register</label>
          <p className="font-semibold text-md">Welcome Back!</p>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  {...register("firstname")}
                  id="firstName"
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${
                    errors.firstname ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="John"
                />
                {errors.firstname && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstname.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  {...register("lastname")}
                  id="lastName"
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${
                    errors.lastname ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Doe"
                />
                {errors.lastname && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lastname.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                autoComplete="email"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${
                  errors.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                {...register("password")}
                id="password"
                type="password"
                autoComplete="new-password"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:black focus:border-black ${
                  errors.password ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Create a strong password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters with uppercase, lowercase, and
                number
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-2 text-sm">{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !isValid}
              className="w-full flex justify-center py-3 cursor-pointer px-4 border border-transparent bg-black rounded-lg shadow-sm text-sm font-medium text-white  hover:bg-gray-800 focus:outline-none  disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
