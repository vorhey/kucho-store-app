const saveLog = async (logData) => {
  try {
    const response = await fetch("/api/audit-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });
    return await response.json();
  } catch (error) {
    console.error("Audit log error:", error);
    throw error;
  }
};

export const logUserAction = (userId, action, details) => {
  return saveLog({
    type: "USER_ACTION",
    userId,
    action,
    details,
    timestamp: new Date(),
  });
};

export const logSystemEvent = (event, details) => {
  return saveLog({
    type: "SYSTEM_EVENT",
    event,
    details,
    timestamp: new Date(),
  });
};
