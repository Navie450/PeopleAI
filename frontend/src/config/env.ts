import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_SESSION_TIMEOUT_MINUTES: z.string().transform(Number).default('30')
})

export const env = envSchema.parse(import.meta.env)
