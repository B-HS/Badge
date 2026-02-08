import { LRUCache } from 'lru-cache'
import { createHash } from 'crypto'
import type { ImageRequest, CachedImage } from '#types/index'

const CACHE_MAX_SIZE = parseInt(process.env.CACHE_MAX_SIZE ?? '104857600', 10)
const CACHE_MAX_ITEMS = parseInt(process.env.CACHE_MAX_ITEMS ?? '500', 10)

const cache = new LRUCache<string, CachedImage>({
    max: CACHE_MAX_ITEMS,
    maxSize: CACHE_MAX_SIZE,
    sizeCalculation: (value) => value.size,
})

export const generateCacheKey = (request: ImageRequest): string => {
    const keyInput = {
        width: request.width,
        height: request.height,
        text: request.text,
        font: request.font,
        fontSize: request.fontSize,
        fontWeight: request.fontWeight,
        color: request.color,
        backgroundColor: request.backgroundColor,
        icon: request.icon,
        iconUrl: request.iconUrl,
        iconSize: request.iconSize,
        tailwind: request.tailwind,
        css: JSON.stringify(request.css),
    }

    const serialized = JSON.stringify(keyInput, Object.keys(keyInput).sort())
    return createHash('sha256').update(serialized).digest('hex').slice(0, 16)
}

export const getCachedImage = (key: string): CachedImage | undefined => {
    return cache.get(key)
}

export const setCachedImage = (key: string, imageData: Buffer): void => {
    const cachedImage: CachedImage = {
        cacheKey: key,
        imageData,
        createdAt: Date.now(),
        size: imageData.length,
    }
    cache.set(key, cachedImage)
}

export const getCacheStats = () => {
    return {
        size: cache.size,
        calculatedSize: cache.calculatedSize,
        maxSize: CACHE_MAX_SIZE,
        maxItems: CACHE_MAX_ITEMS,
    }
}
