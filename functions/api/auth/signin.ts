import { sign } from "jsonwebtoken"

type Credentials = {
  email: string
  password: string
}

type User = {
  id: string
  email: string
  password_hash: string
  name: string
}

export async function onRequestPost({
  request,
  env,
}: {
  request: Request
  env: { DB: D1Database; JWT_SECRET: string }
}) {
  try {
    const jsonData = await request.json<Credentials>()
    const { email, password } = jsonData

    const stmt = env.DB.prepare(`
      SELECT id, email, password_hash, name
      FROM users WHERE email = ?
    `)

    const user: User = await stmt.bind(email).first()

    if (!user) {
      throw new Error("Invalid credentials")
    }

    // Hash the provided password
    const encoder = new TextEncoder()
    const passwordData = encoder.encode(password)
    const hashedPassword = await crypto.subtle.digest("SHA-256", passwordData)

    // Compare hashes using timing-safe comparison
    const storedHash = new Uint8Array(Buffer.from(user.password_hash, "hex"))
    const newHash = new Uint8Array(hashedPassword)

    const validPassword = crypto.subtle.timingSafeEqual(storedHash, newHash)
    if (!validPassword) {
      throw new Error("Invalid credentials")
    }

    const token = sign({ userId: user.id }, env.JWT_SECRET, {
      expiresIn: "7d",
    })

    return Response.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 }
    )
  }
}
