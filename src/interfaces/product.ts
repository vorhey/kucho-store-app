import type { Product } from "@/types/product"

export interface ProductResponse {
  success: boolean
  data: Product[]
}
