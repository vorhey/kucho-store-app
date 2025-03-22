import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PackageOpen } from "lucide-react";
import heroImage from "@/assets/images/hero-cat.png";
import kittyImage from "@/assets/images/kitty-face.png";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center overflow-hidden py-12 sm:py-16">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-pattern" />
        <div className="relative text-center px-4 flex flex-col gap-4 justify-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img src={heroImage} alt="Cat in a box" className="w-64 mx-auto" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight"
          >
            <span className="bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-purple-400 bg-clip-text text-transparent">
              Bienvenido a Kucho Store
            </span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto"
          >
            Encuentra los Productos Purr-fectos para Amantes de los Gatos
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link href="/shop">
              <motion.div
                whileHover={{ scale: 1.5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 text-lg h-12 group mt-16 hover:cursor-pointer"
                >
                  <img src={kittyImage} alt="Kitty face" className="w-6 h-6" />
                  Explorar colección
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    initial={{ x: 0 }}
                    animate={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </motion.svg>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
