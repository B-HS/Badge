import { Hono } from 'hono'
import type { ImageRequest } from '#types/index'
import { validateImageRequest, parseQueryParams } from '@utils/validation'
import { generateImage } from '@services/imageGenerator'
import { generateCacheKey, getCachedImage, setCachedImage } from '@services/cache'

export const imageRoute = new Hono()

imageRoute.get('/', async (c) => {
    const query = c.req.query()
    const params = parseQueryParams(query)

    const errors = validateImageRequest(params)

    if (errors.length > 0) {
        return c.json(
            {
                error: 'Invalid parameter',
                details: errors,
            },
            400,
        )
    }

    const request = params as ImageRequest
    const cacheKey = generateCacheKey(request)

    const cached = getCachedImage(cacheKey)

    if (cached) {
        return new Response(new Uint8Array(cached.imageData), {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'X-Cache': 'HIT',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        })
    }

    try {
        const imageBuffer = await generateImage(request)
        setCachedImage(cacheKey, imageBuffer)

        return new Response(new Uint8Array(imageBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'X-Cache': 'MISS',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        })
    } catch (error) {
        return c.json(
            {
                error: 'Image generation failed',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            500,
        )
    }
})
