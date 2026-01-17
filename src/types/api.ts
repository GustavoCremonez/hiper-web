export interface ApiErrorResponse {
  code: string
  message: string
  errors?: Record<string, string[]>
  details?: string
}

export interface ValidationErrors {
  [field: string]: string[]
}
