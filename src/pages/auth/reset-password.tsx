import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BreadcrumbType, getBreadcrumbs } from "@/lib/breadcrumbs";
import { resetPassword } from "@/services/auth";
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
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-md space-y-6">
        <Breadcrumbs items={getBreadcrumbs(BreadcrumbType.ResetPassword)} />
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-red-500 mb-4">
            Token de restablecimiento inválido o faltante.
          </p>
          <Button onClick={() => setLocation("/request-reset")}>
            Solicitar Nuevo Enlace de Restablecimiento
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
        setError(response.message || "Ocurrió un error");
      }
    } catch (_err) {
      setError("Ocurrió un error al restablecer la contraseña");
    }
  };

  const password = watch("password");

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-md space-y-6">
      <Breadcrumbs items={getBreadcrumbs(BreadcrumbType.ResetPassword)} />
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Establecer Nueva Contraseña</h1>

        {success ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              Tu contraseña ha sido restablecida exitosamente.
            </p>
            <Button onClick={() => setLocation("/signin")}>
              Iniciar Sesión
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Nueva Contraseña
              </label>
              <Input
                type="password"
                id="password"
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 8,
                    message: "La contraseña debe tener al menos 8 caracteres",
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
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1"
              >
                Confirmar Contraseña
              </label>
              <Input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword", {
                  required: "Por favor confirma tu contraseña",
                  validate: (value) =>
                    value === password || "Las contraseñas no coinciden",
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
              Restablecer Contraseña
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
