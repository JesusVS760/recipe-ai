"use client";
import { sendVerificationCode } from "@/lib/auth-actions.";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const forgotPasswordSchema = z.object({
  email: z.email(),
});

type ForgotPassworData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  async function onSubmit(data: ForgotPassworData) {
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("email", data.email);
    let shouldRedirect = false;

    try {
      const { success, error } = await sendVerificationCode(formData);
      if (success) {
        sessionStorage.setItem("verifyEmail", data.email);
        toast("Succesfully sent. Please check your email ✔️!");
        shouldRedirect = true;
        router.push("/auth/reset");
      }
      if (error) {
        toast("Something went wrong, try again!");
      }
    } catch {
      setError("An unexpected error occurred, try again!");
    } finally {
      setIsLoading(false);
    }
    if (shouldRedirect) {
      router.push("/auth/verify");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-black">
            Forgot Password?
          </h1>
        </div>
        <div>
          <p className="text-black/90">Enter email to get access.</p>
        </div>
      </div>
      <div className=" bg-white rounded-2xl shadow-xl p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              autoComplete="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && (
              <div className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </div>
            )}
          </div>
          <button disabled={isLoading}>
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
                Sending...{" "}
              </>
            ) : (
              "Send verification code"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
