import { Hono } from 'hono'
import { getCacheStats } from '@services/cache'

export const healthRoute = new Hono()

healthRoute.get('/', (c) => {
    return c.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        cache: getCacheStats(),
    })
})
