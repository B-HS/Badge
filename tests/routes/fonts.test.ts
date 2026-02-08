import { describe, test, expect } from 'bun:test'
import app from '../../server'

describe('GET /api/fonts', () => {
    test('returns list of available fonts', async () => {
        const res = await app.request('/api/fonts')
        expect(res.status).toBe(200)

        const body = await res.json()
        expect(body).toHaveProperty('local')
        expect(body).toHaveProperty('googleFontsSupported')
    })

    test('includes Inter in local fonts', async () => {
        const res = await app.request('/api/fonts')
        const body = await res.json()

        expect(body.local.some((f: { name: string }) => f.name === 'Inter')).toBe(true)
    })

    test('includes Noto Sans KR in local fonts', async () => {
        const res = await app.request('/api/fonts')
        const body = await res.json()

        expect(body.local.some((f: { name: string }) => f.name === 'Noto Sans KR')).toBe(true)
    })

    test('indicates Google Fonts support', async () => {
        const res = await app.request('/api/fonts')
        const body = await res.json()

        expect(body.googleFontsSupported).toBe(true)
    })
})
