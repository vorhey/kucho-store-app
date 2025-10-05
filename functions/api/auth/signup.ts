import { v4 as uuidv4 } from "uuid"

export async function onRequestPost({ request, env }) {
  try {
    const { email, password, name } = await request.json()

    // Hash password using SHA-256
    const encoder = new TextEncoder()
    const passwordData = encoder.encode(password)
    const hashedBuffer = await crypto.subtle.digest("SHA-256", passwordData)
    const passwordHash = Buffer.from(hashedBuffer).toString("hex")
    const userId = uuidv4()

    // Insert user
    const stmt = env.DB.prepare(`
      INSERT INTO users (id, email, password_hash, name)
      VALUES (?, ?, ?, ?)
    `)

    await stmt.bind(userId, email, passwordHash, name).run()

    return Response.json({
      success: true,
      message: "User created successfully",
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
