import { describe, test, expect, beforeEach } from 'bun:test'
import { generateCacheKey, getCachedImage, setCachedImage, getCacheStats } from '@services/cache'
import type { ImageRequest } from '@types/index'

const createRequest = (overrides: Partial<ImageRequest> = {}): ImageRequest => ({
    width: 400,
    height: 200,
    text: 'Hello',
    font: 'Inter',
    fontSize: 32,
    fontWeight: 400,
    color: '#000000',
    backgroundColor: '#ffffff',
    tailwind: '',
    css: {},
    ...overrides,
})

describe('generateCacheKey', () => {
    test('generates consistent keys for same parameters', () => {
        const request = createRequest()
        const key1 = generateCacheKey(request)
        const key2 = generateCacheKey(request)
        expect(key1).toBe(key2)
    })

    test('generates different keys for different parameters', () => {
        const request1 = createRequest({ text: 'Hello' })
        const request2 = createRequest({ text: 'World' })
        expect(generateCacheKey(request1)).not.toBe(generateCacheKey(request2))
    })

    test('generates 16 character hex keys', () => {
        const request = createRequest()
        const key = generateCacheKey(request)
        expect(key).toMatch(/^[0-9a-f]{16}$/)
    })

    test('key changes with any parameter change', () => {
        const baseRequest = createRequest()
        const baseKey = generateCacheKey(baseRequest)

        const widthKey = generateCacheKey(createRequest({ width: 500 }))
        const heightKey = generateCacheKey(createRequest({ height: 300 }))
        const fontKey = generateCacheKey(createRequest({ font: 'Arial' }))
        const colorKey = generateCacheKey(createRequest({ color: '#ff0000' }))

        expect(widthKey).not.toBe(baseKey)
        expect(heightKey).not.toBe(baseKey)
        expect(fontKey).not.toBe(baseKey)
        expect(colorKey).not.toBe(baseKey)
    })
})

describe('setCachedImage and getCachedImage', () => {
    test('stores and retrieves image data', () => {
        const key = 'test-key-001'
        const imageData = Buffer.from('test image data')

        setCachedImage(key, imageData)
        const cached = getCachedImage(key)

        expect(cached).toBeDefined()
        expect(cached?.imageData.toString()).toBe('test image data')
        expect(cached?.cacheKey).toBe(key)
        expect(cached?.size).toBe(imageData.length)
    })

    test('returns undefined for non-existent keys', () => {
        const cached = getCachedImage('non-existent-key')
        expect(cached).toBeUndefined()
    })

    test('overwrites existing entries with same key', () => {
        const key = 'test-key-002'
        const imageData1 = Buffer.from('first')
        const imageData2 = Buffer.from('second')

        setCachedImage(key, imageData1)
        setCachedImage(key, imageData2)
        const cached = getCachedImage(key)

        expect(cached?.imageData.toString()).toBe('second')
    })
})

describe('getCacheStats', () => {
    test('returns cache statistics', () => {
        const stats = getCacheStats()
        expect(stats).toHaveProperty('size')
        expect(stats).toHaveProperty('calculatedSize')
        expect(stats).toHaveProperty('maxSize')
        expect(stats).toHaveProperty('maxItems')
    })
})
