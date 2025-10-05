import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProfileBreadcrumbs } from "@/lib/breadcrumbs";
import { updateUserProfile } from "@/services/auth";
import type { UserProfileData } from "@/types/auth";

export default function ProfilePage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data - in a real app, this would come from your auth context or API
  const [userData, setUserData] = useState({
    name: "Usuario Ejemplo",
    email: "usuario@ejemplo.com",
    phone: "+34 612 345 678",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileData>({
    defaultValues: userData,
  });

  const onSubmit = async (data: UserProfileData) => {
    try {
      // In a real app, this would call your API
      const response = await updateUserProfile(data);
      if (response.success) {
        setUserData(data);
        setSuccess(true);
        setError("");
        setTimeout(() => {
          setSuccess(false);
          setIsEditing(false);
        }, 2000);
      } else {
        setError(response.message || "Ocurrió un error");
      }
    } catch (_err) {
      setError("Ocurrió un error al actualizar el perfil");
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-6 sm:py-8 max-w-md space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Breadcrumbs items={getProfileBreadcrumbs()} />
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
          Mi Perfil
        </motion.h1>

        <AnimatePresence mode="wait">
          {success && (
            <motion.div
              className="mb-4 p-2 bg-green-100 text-green-700 rounded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              Perfil actualizado correctamente
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.form
              key="edit-form"
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
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Nombre
                </label>
                <Input
                  type="text"
                  id="name"
                  {...register("name", {
                    required: "El nombre es obligatorio",
                  })}
                  className="w-full"
                />
                <AnimatePresence>
                  {errors.name && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {errors.name.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Correo Electrónico
                </label>
                <Input
                  type="email"
                  id="email"
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

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-1"
                >
                  Teléfono
                </label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  className="w-full"
                />
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
                className="flex space-x-3"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button type="submit" className="flex-1">
                  Guardar Cambios
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </motion.div>
            </motion.form>
          ) : (
            <motion.div
              key="profile-view"
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="border-b pb-3"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-medium">{userData.name}</p>
              </motion.div>

              <motion.div
                className="border-b pb-3"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm text-gray-500">Correo Electrónico</p>
                <p className="font-medium">{userData.email}</p>
              </motion.div>

              <motion.div
                className="border-b pb-3"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium">
                  {userData.phone || "No especificado"}
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  Editar Perfil
                </Button>
              </motion.div>

              <motion.div
                className="mt-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <a
                  href="/reset-password"
                  className="text-blue-500 hover:underline text-sm"
                >
                  Cambiar Contraseña
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
