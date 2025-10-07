import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BreadcrumbType, getBreadcrumbs } from "@/lib/breadcrumbs";
import { getUserProfile, updateUserProfile } from "@/services/auth";
import type { UserProfileData } from "@/types/auth";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, setUser, isLoading: isAuthLoading, signOut } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await getUserProfile();
      if (response.success && response.user) {
        setUser(response.user);
        return response.user;
      }
      throw new Error(response.message || "Error fetching profile");
    },
    enabled: !user && !isAuthLoading, // Only fetch if no user in context
  });

  const {
    mutate,
    isPending: isUpdating,
    isSuccess: isUpdateSuccess,
    error: updateError,
  } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(["userProfile"], (oldData: UserProfileData) => {
        return { ...oldData, ...variables };
      });

      if (user) {
        setUser({
          ...user,
          name: variables.name,
          email: variables.email,
        });
      }

      setTimeout(() => {
        setIsEditing(false);
      }, 2000);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserProfileData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const userData = user || profileData;

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name ?? "",
        email: userData.email,
        phone: "",
      });
    }
  }, [userData, reset]);

  const onSubmit = (data: UserProfileData) => {
    mutate(data);
  };

  const isLoading = isAuthLoading || isProfileLoading;

  return (
    <motion.div
      className="container mx-auto px-4 py-6 sm:py-8 max-w-md space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Breadcrumbs items={getBreadcrumbs(BreadcrumbType.Profile)} />
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

        {isLoading ? (
          <motion.p
            className="text-center text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Cargando perfil...
          </motion.p>
        ) : !userData ? (
          <motion.div
            className="text-center space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-600">
              Inicia sesión para ver tu información de perfil.
            </p>
            {profileError && (
              <p className="text-red-500 text-sm">{profileError.message}</p>
            )}
          </motion.div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              {isUpdateSuccess && (
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
                    {updateError && (
                      <motion.div
                        className="text-red-500 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {updateError.message}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    className="flex space-x-3"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      type="submit"
                      variant="outline"
                      className="flex-1"
                      disabled={isUpdating}
                    >
                      <Save className="w-4 h-4 mr-2 inline" />
                      {isUpdating ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2 inline" />
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
                    className="flex space-x-3"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="w-full"
                    >
                      <User className="w-4 h-4 mr-2 inline" />
                      Editar Perfil
                    </Button>
                    <Button
                      onClick={signOut}
                      variant="outline"
                      className="w-full hover:bg-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2 inline" />
                      Cerrar Sesión
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
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
