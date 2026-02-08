import { Hono } from 'hono'
import { getAvailableFonts } from '@services/fontLoader'

export const fontsRoute = new Hono()

fontsRoute.get('/', (c) => {
    return c.json(getAvailableFonts())
})
