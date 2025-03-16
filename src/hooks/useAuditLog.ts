import type { AuditLogRequest } from "@/interfaces/auditLog";
import { saveLog } from "@/services/auditLogger";
import { useMutation } from "@tanstack/react-query";

const useAuditLogMutation = () => {
  return useMutation({
    mutationFn: (logData: AuditLogRequest) => saveLog(logData),
    onError: (error) => {
      console.error("Audit log save error:", error);
    },
  });
};
export const useLogUserAction = () => {
  const mutation = useAuditLogMutation();
  return (userId: string, action: string, details: any) => {
    return mutation.mutate({
      type: "USER_ACTION",
      userId,
      action,
      details,
      timestamp: new Date(),
    });
  };
};
