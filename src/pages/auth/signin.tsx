import { motion } from "framer-motion"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useLocation } from "wouter"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { useScrollTop } from "@/hooks/useScrollTop"
import { getSignInBreadcrumbs } from "@/lib/breadcrumbs"
import { signIn } from "@/services/auth"
import type { SignInData } from "@/types/auth"

export default function SignInPage() {
  const [error, setError] = useState("")
  const { setUser } = useAuth()
  const [, setLocation] = useLocation()
  const { register, handleSubmit } = useForm<SignInData>()

  useScrollTop()

  const onSubmit = async (data: SignInData) => {
    try {
      const response = await signIn(data)
      if (response.success && response.user) {
        setUser(response.user)
        setLocation("/")
      } else {
        setError(response.message || "Ocurrió un error")
      }
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión")
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-md space-y-6">
      <Breadcrumbs items={getSignInBreadcrumbs()} />
      <motion.div
        className="bg-white p-8 rounded-lg shadow-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-6">
          Iniciar Sesión
        </motion.h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium mb-1">Correo</label>
            <Input
              type="email"
              {...register("email", { required: true })}
              className="w-full"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <Input
              type="password"
              {...register("password", { required: true })}
              className="w-full"
            />
          </motion.div>

          {error && (
            <motion.div
              className="text-red-500 text-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              className="w-full bg-primary text-white rounded-lg py-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Iniciar Sesión
            </motion.button>
          </motion.div>
        </form>

        <motion.div variants={itemVariants} className="mt-4 text-center">
          <motion.a
            href="/request-reset"
            className="text-blue-500 hover:underline"
            whileHover={{ scale: 1.05 }}
          >
            ¿Olvidaste tu contraseña?
          </motion.a>
          <motion.div variants={itemVariants} className="mt-2">
            ¿No tienes una cuenta?{" "}
            <motion.a
              href="/signup"
              className="text-blue-500 hover:underline"
              whileHover={{ scale: 1.05 }}
            >
              Regístrate
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
