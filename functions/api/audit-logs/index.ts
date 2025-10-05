export async function onRequestPost({
  request,
  env,
}: {
  request: Request;
  env: { DB: D1Database };
}): Promise<Response> {
  try {
    const logData = await request.json();

    interface LogData {
      type: string;
      timestamp: string | number;
      details: Record<string, unknown>;
      userId?: string;
      action?: string;
      event?: string;
      [key: string]: unknown;
    }

    const { type, timestamp, details, ...rest } = logData as LogData;
    const stmt = env.DB.prepare(`
      INSERT INTO audit_logs (log_type, user_id, action, event, details, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = await stmt
      .bind(
        type,
        rest.userId || null,
        rest.action || null,
        rest.event || null,
        JSON.stringify(details),
        new Date(timestamp).toISOString()
      )
      .run();

    return Response.json({
      success: true,
      logId: result.meta.last_row_id,
      timestamp: new Date().toISOString(),
      message: "Log saved successfully",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.name : "Unknown Error",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
