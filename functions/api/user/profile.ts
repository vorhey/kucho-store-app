import { verify } from "jsonwebtoken";

type TokenPayload = {
  userId: string;
};

type UserRecord = {
  id: string;
  email: string;
  name: string | null;
};

export async function onRequest({
  request,
  env,
}: {
  request: Request;
  env: { DB: D1Database; JWT_SECRET: string };
}): Promise<Response> {
  try {
    const authorization = request.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const token = authorization.slice("Bearer ".length).trim();
    let payload: TokenPayload;

    try {
      const decoded = verify(token, env.JWT_SECRET);
      if (
        typeof decoded !== "object" ||
        decoded === null ||
        !("userId" in decoded)
      ) {
        throw new Error("Invalid token payload");
      }

      payload = { userId: decoded.userId };
    } catch {
      return Response.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    const stmt = env.DB.prepare(`
      SELECT id, email, name, created_at, updated_at
      FROM users
      WHERE id = ?
    `);

    const user = (await stmt.bind(payload.userId).first()) as UserRecord | null;

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load user profile";
    return Response.json(
      { success: false, message: message || "Failed to load user profile" },
      { status: 500 },
    );
  }
}
