import { describe, test, expect } from 'bun:test'
import app from '../../server'

describe('GET /api/image', () => {
    test('returns 400 when width is missing', async () => {
        const res = await app.request('/api/image?height=200')
        expect(res.status).toBe(400)
        const body = await res.json()
        expect(body.error).toBe('Invalid parameter')
    })

    test('returns 400 when height is missing', async () => {
        const res = await app.request('/api/image?width=400')
        expect(res.status).toBe(400)
        const body = await res.json()
        expect(body.error).toBe('Invalid parameter')
    })

    test('returns 400 when width is out of range', async () => {
        const res = await app.request('/api/image?width=5000&height=200')
        expect(res.status).toBe(400)
        const body = await res.json()
        expect(body.details.some((d: { field: string }) => d.field === 'width')).toBe(true)
    })

    test('returns PNG image for valid request', async () => {
        const res = await app.request('/api/image?width=100&height=100')
        expect(res.status).toBe(200)
        expect(res.headers.get('content-type')).toBe('image/png')
    })

    test('returns PNG image with text', async () => {
        const res = await app.request('/api/image?width=200&height=100&text=Hello')
        expect(res.status).toBe(200)
        expect(res.headers.get('content-type')).toBe('image/png')
    })

    test('handles empty text gracefully', async () => {
        const res = await app.request('/api/image?width=100&height=100&text=')
        expect(res.status).toBe(200)
        expect(res.headers.get('content-type')).toBe('image/png')
    })

    test('applies tailwind styles', async () => {
        const res = await app.request('/api/image?width=200&height=100&text=Test&tailwind=bg-blue-500%20text-white')
        expect(res.status).toBe(200)
        expect(res.headers.get('content-type')).toBe('image/png')
    })

    test('ignores invalid tailwind classes', async () => {
        const res = await app.request('/api/image?width=200&height=100&text=Test&tailwind=invalid-class-xyz')
        expect(res.status).toBe(200)
        expect(res.headers.get('content-type')).toBe('image/png')
    })

    test('applies custom CSS styles', async () => {
        const css = encodeURIComponent(JSON.stringify({ borderRadius: '16px' }))
        const res = await app.request(`/api/image?width=200&height=100&text=Test&css=${css}`)
        expect(res.status).toBe(200)
        expect(res.headers.get('content-type')).toBe('image/png')
    })

    test('ignores invalid CSS JSON', async () => {
        const res = await app.request('/api/image?width=200&height=100&text=Test&css=invalid-json')
        expect(res.status).toBe(200)
        expect(res.headers.get('content-type')).toBe('image/png')
    })

    test('includes X-Cache header', async () => {
        const res = await app.request('/api/image?width=100&height=100&text=CacheTest')
        expect(res.status).toBe(200)
        expect(res.headers.get('x-cache')).toBeTruthy()
    })

    test('includes Cache-Control header', async () => {
        const res = await app.request('/api/image?width=100&height=100')
        expect(res.status).toBe(200)
        expect(res.headers.get('cache-control')).toContain('max-age')
    })
})

describe('GET /api/health', () => {
    test('returns ok status', async () => {
        const res = await app.request('/api/health')
        expect(res.status).toBe(200)
        const body = await res.json()
        expect(body.status).toBe('ok')
        expect(body.timestamp).toBeTruthy()
    })
})
