import type {
  AuditLogApiResponse,
  AuditLogRequest,
} from "@/interfaces/auditLog";

export const saveLog = async (
  logData: AuditLogRequest
): Promise<AuditLogApiResponse> => {
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
