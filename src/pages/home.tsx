import { motion } from "framer-motion"
import { ChevronRight, HeartIcon } from "lucide-react"
import { Link } from "wouter"
import heroImage from "@/assets/images/hero-cat.png"
import kittyImage from "@/assets/images/kitty-face.png"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  // This timestamp will update on HMR if working correctly
  console.log("HomePage rendered at:", new Date().toLocaleTimeString())

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
            className="text-4xl sm:text-6xl md:text-7xl tracking-tight"
          >
            <span className="bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-purple-400 bg-clip-text text-transparent">
              Kucho Store{" "}
              <HeartIcon
                className="inline w-10 h-10 align-middle relative -top-2 text-pink-500"
                strokeWidth={2}
              />
            </span>
          </motion.h1>
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
                <div className="rainbow-border-animated mt-2 inline-block">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 text-lg h-12 group bg-white hover:cursor-pointer border-none shadow-none !flex items-center gap-2"
                  >
                    <img
                      src={kittyImage}
                      alt="Kitty face"
                      className="w-6 h-6"
                    />
                    Explorar colección
                    <motion.div
                      initial={{ x: 0 }}
                      animate={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
