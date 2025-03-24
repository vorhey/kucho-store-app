import { useState } from "react";
import { useLocation } from "wouter";
import { resetPassword } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import type { ResetPasswordData } from "@/types/auth";

export default function ResetPasswordPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [, setLocation] = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordData & { confirmPassword: string }>();

  // Get token from URL query params
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (!token) {
    return (
      <div className="container mx-auto mt-8 max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-red-500 mb-4">Invalid or missing reset token.</p>
          <Button onClick={() => setLocation("/request-reset")}>
            Request New Reset Link
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = async (
    data: ResetPasswordData & { confirmPassword: string }
  ) => {
    try {
      const response = await resetPassword({ token, password: data.password });
      if (response.success) {
        setSuccess(true);
        setError("");
      } else {
        setError(response.message || "An error occurred");
      }
    } catch (err) {
      setError("An error occurred while resetting password");
    }
  };

  const password = watch("password");

  return (
    <div className="container mx-auto mt-8 max-w-md">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Set New Password</h1>

        {success ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              Your password has been successfully reset.
            </p>
            <Button onClick={() => setLocation("/signin")}>Sign In</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <Input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className="w-full"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <Input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="w-full"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
