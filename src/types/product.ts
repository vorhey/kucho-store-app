export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: "clothing" | "accessories" | "toys" | "home-decor" | "furniture"
  stock: number
}

export interface CartItem {
  product: Product
  quantity: number
}
