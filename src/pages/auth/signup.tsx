import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { signIn, signUp } from "@/services/auth";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import type { SignUpData } from "@/types/auth";
import { motion } from "framer-motion";
import { useScrollTop } from "@/hooks/useScrollTop";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getSignUpBreadcrumbs } from "@/lib/breadcrumbs";

export default function SignUpPage() {
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const [, setLocation] = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>();

  useScrollTop();

  const onSubmit = async (data: SignUpData) => {
    try {
      const response = await signUp(data);
      if (response.success) {
        const signInResponse = await signIn(data);
        if (signInResponse.success && signInResponse.user) {
          setUser(signInResponse.user);
          setLocation("/");
        }
      } else {
        setError(response.message || "Ocurrió un error");
      }
    } catch (err) {
      setError("Ocurrió un error durante el registro");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-md space-y-6">
      <Breadcrumbs items={getSignUpBreadcrumbs()} />
      <motion.div
        className="bg-white p-8 rounded-lg shadow-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="text-2xl font-bold mb-6" variants={itemVariants}>
          Crear Cuenta
        </motion.h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <Input
              type="text"
              {...register("name")}
              className="w-full"
              placeholder="Tu nombre"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium mb-1">
              Correo electrónico
            </label>
            <Input
              type="email"
              {...register("email", {
                required: "El correo electrónico es obligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Dirección de correo electrónico inválida",
                },
              })}
              className="w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <Input
              type="password"
              {...register("password", {
                required: "La contraseña es obligatoria",
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
          </motion.div>

          {error && (
            <motion.div
              className="text-red-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              className="w-full bg-primary text-white rounded-lg py-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Registrarse
            </motion.button>
          </motion.div>
        </form>

        <motion.div className="mt-4 text-center" variants={itemVariants}>
          ¿Ya tienes una cuenta?{" "}
          <motion.a
            href="/signin"
            className="text-blue-500 hover:underline"
            whileHover={{ scale: 1.05 }}
          >
            Iniciar sesión
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
}
