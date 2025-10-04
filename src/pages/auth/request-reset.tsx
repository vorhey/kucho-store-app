import { useState } from "react";
import { useLocation } from "wouter";
import { requestPasswordReset } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import type { RequestPasswordResetData } from "@/types/auth";
import { Breadcrumbs } from "@/components/Breadcrumbs";

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
        setError(response.message || "Ocurrió un error");
      }
    } catch (err) {
      setError(
        "Ocurrió un error al solicitar el restablecimiento de contraseña",
      );
    }
  };

  return (
    <motion.div
      className="container mx-auto mt-8 md:mt-24 max-w-md space-y-6 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Breadcrumbs />
      <motion.div
        className="bg-white p-8 rounded-lg shadow-md"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h1
          className="text-2xl font-bold mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Restablecer Contraseña
        </motion.h1>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              className="text-center"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                className="text-green-600 mb-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Si existe una cuenta con ese correo electrónico, recibirás
                instrucciones para restablecer tu contraseña.
              </motion.p>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button onClick={() => setLocation("/signin")}>
                  Volver a Iniciar Sesión
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium mb-1">
                  Correo Electrónico
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
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    className="text-red-500 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button type="submit" className="w-full">
                  Solicitar Enlace de Restablecimiento
                </Button>
              </motion.div>

              <motion.div
                className="text-center mt-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <a href="/signin" className="text-blue-500 hover:underline">
                  Volver a Iniciar Sesión
                </a>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
