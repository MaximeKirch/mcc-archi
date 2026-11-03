import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_WP_API_URL: z.string().url(),
    VITE_UMAMI_WEBSITE_ID: z.string().uuid().optional(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})
