import { describe, test, expect } from 'bun:test'
import { loadFont, loadLocalFont, getAvailableFonts } from '@services/fontLoader'

describe('getAvailableFonts', () => {
    test('returns list of local fonts', () => {
        const fonts = getAvailableFonts()
        expect(fonts.local).toBeArray()
        expect(fonts.local.length).toBeGreaterThan(0)
        expect(fonts.local.some((f) => f.name === 'Inter')).toBe(true)
        expect(fonts.local.some((f) => f.name === 'Noto Sans KR')).toBe(true)
    })

    test('indicates Google Fonts support', () => {
        const fonts = getAvailableFonts()
        expect(fonts.googleFontsSupported).toBe(true)
    })
})

describe('loadLocalFont', () => {
    test('loads Inter font', async () => {
        const font = await loadLocalFont('Inter', 400)
        expect(font).not.toBeNull()
        expect(font?.byteLength).toBeGreaterThan(0)
    })

    test('loads Noto Sans KR font', async () => {
        const font = await loadLocalFont('Noto Sans KR', 400)
        expect(font).not.toBeNull()
        expect(font?.byteLength).toBeGreaterThan(0)
    })

    test('returns null for unknown font', async () => {
        const font = await loadLocalFont('Unknown Font', 400)
        expect(font).toBeNull()
    })

    test('uses closest available weight', async () => {
        const font500 = await loadLocalFont('Inter', 500)
        const font400 = await loadLocalFont('Inter', 400)
        expect(font500).not.toBeNull()
        expect(font500?.byteLength).toBe(font400?.byteLength)
    })
})

describe('loadFont', () => {
    test('loads local font when available', async () => {
        const fontConfig = await loadFont('Inter', 400)
        expect(fontConfig).not.toBeNull()
        expect(fontConfig?.name).toBe('Inter')
        expect(fontConfig?.source).toBe('local')
    })

    test('falls back to Inter for unknown fonts', async () => {
        const fontConfig = await loadFont('Completely Unknown Font', 400)
        expect(fontConfig).not.toBeNull()
        expect(fontConfig?.name).toBe('Inter')
        expect(fontConfig?.source).toBe('local')
    })

    test('returns weight in config', async () => {
        const fontConfig = await loadFont('Inter', 700)
        expect(fontConfig?.weight).toBe(700)
    })
})
