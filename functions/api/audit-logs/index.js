export async function onRequestPost({ request, env }) {
  try {
    const logData = await request.json();

    const { type, timestamp, details, ...rest } = logData;
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
      logId: result.lastRowId,
      timestamp: new Date().toISOString(),
      message: "Log saved successfully",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.name,
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
