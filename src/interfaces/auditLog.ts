export interface AuditLogResponse {
  success: boolean
  logId: string
  timestamp: string
  message: string
}

export interface AuditLogErrorResponse {
  success: false
  error: string
  message: string
  timestamp: string
}

export type AuditLogApiResponse = AuditLogResponse | AuditLogErrorResponse

export interface AuditLogUserActionRequest {
  type: "USER_ACTION"
  userId: string
  action: string
  details: Record<string, unknown>
  timestamp: Date
}

export interface AuditLogSystemEventRequest {
  type: "SYSTEM_EVENT"
  event: string
  details: Record<string, unknown>
  timestamp: Date
}

export type AuditLogRequest =
  | AuditLogUserActionRequest
  | AuditLogSystemEventRequest
