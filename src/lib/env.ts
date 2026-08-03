export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";
}

export function getPublicSurface(): string {
  return "public_web";
}
