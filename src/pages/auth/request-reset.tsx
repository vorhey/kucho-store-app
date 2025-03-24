import { useState } from "react";
import { useLocation } from "wouter";
import { requestPasswordReset } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import type { RequestPasswordResetData } from "@/types/auth";

export default function RequestResetPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [, setLocation] = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestPasswordResetData>();

  const onSubmit = async (data: RequestPasswordResetData) => {
    try {
      const response = await requestPasswordReset(data);
      if (response.success) {
        setSuccess(true);
        setError("");
      } else {
        setError(response.message || "An error occurred");
      }
    } catch (err) {
      setError("An error occurred while requesting password reset");
    }
  };

  return (
    <div className="container mx-auto mt-8 max-w-md">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

        {success ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              If an account exists with that email, you will receive password
              reset instructions.
            </p>
            <Button onClick={() => setLocation("/signin")}>
              Return to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button type="submit" className="w-full">
              Request Reset Link
            </Button>

            <div className="text-center mt-4">
              <a href="/signin" className="text-blue-500 hover:underline">
                Back to Sign In
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
