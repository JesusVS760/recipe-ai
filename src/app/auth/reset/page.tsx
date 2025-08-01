"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const resetSchema = z.object({
  oldPassword: z.string().min(8).max(12),
  newPassword: z.string().min(8).max(12),
  email: z.email(),
});

type ResetDataType = z.infer<typeof resetSchema>;

export default function ResetPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(resetSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ResetDataType) {
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("oldPassword", data.oldPassword);
    formData.append("newPassword", data.newPassword);
    formData.append("email", data.email);

    try {
      // add logic later
    } catch {
      setError("An unexpected error occurred, try again!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className=" flex flex-col items-center justify-center h-screen">
      <div className="bg-white p-8 px-12 rounded- border-2 shadow-2xl">
        <div className=" flex flex-col items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="mx-auto h-12 w-12 bg-black rounded-xl flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a1 1 0 011 1v1m-2-2a1 1 0 00-1 1v1m4-1l1-1m-1 1l1 1"
                />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-black">
            Reset account password
          </h1>
          <p className="text-black/80 ">
            Enter a new password for
            <span className="text-blue-600 animate-pulse">email</span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white  py-12 rounded-xl space-y-4"
        >
          <div>
            <div>
              <input
                {...register("oldPassword")}
                type="password"
                id="oldPassword"
                maxLength={12}
                placeholder="Password"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.oldPassword && (
                <div className="mt-1 text-sm text-red-600">
                  {errors.oldPassword.message}
                </div>
              )}
            </div>

            <div>
              <input
                {...register("newPassword")}
                type="password"
                id="newPassword"
                maxLength={12}
                placeholder="Password"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.newPassword && (
                <div className="mt-1 text-sm text-red-600">
                  {errors.newPassword.message}
                </div>
              )}
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>
          <button disabled={isValid || isLoading}>
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
                Updating...
              </>
            ) : (
              "Reset Password"
            )}{" "}
          </button>
        </form>
      </div>
    </div>
  );
}
