"use client";
import { sendVerificationCode } from "@/lib/auth-actions.";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cookie } from "lucide-react";
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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex items-center justify-center bg-sky-600">
        <Cookie className="text-white w-32 h-32" />
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md lg:max-w-xl space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Forgot Password? 🤔
          </h1>
          <p className="text-sm text-gray-700 text-center">
            No worries — it happens! Just enter the email address associated
            with your account, and we'll send you a verification code to help
            you securely reset your password.
          </p>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
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
            <button
              disabled={isLoading || !isValid}
              className="w-full flex justify-center py-3 px-4 border border-transparent bg-black rounded-lg shadow-sm text-sm font-medium text-white hover:bg-gray-800 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mt-4"
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
                  Sending...{" "}
                </>
              ) : (
                "Send verification code"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
