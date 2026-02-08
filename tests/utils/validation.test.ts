import { describe, test, expect } from 'bun:test'
import { validateImageRequest, parseQueryParams, isValidColor } from '@utils/validation'

describe('isValidColor', () => {
    test('accepts valid hex colors', () => {
        expect(isValidColor('#fff')).toBe(true)
        expect(isValidColor('#ffffff')).toBe(true)
        expect(isValidColor('#000')).toBe(true)
        expect(isValidColor('#000000')).toBe(true)
        expect(isValidColor('#3b82f6')).toBe(true)
    })

    test('accepts valid CSS color names', () => {
        expect(isValidColor('black')).toBe(true)
        expect(isValidColor('white')).toBe(true)
        expect(isValidColor('red')).toBe(true)
        expect(isValidColor('transparent')).toBe(true)
    })

    test('rejects invalid colors', () => {
        expect(isValidColor('#gggggg')).toBe(false)
        expect(isValidColor('notacolor')).toBe(false)
        expect(isValidColor('')).toBe(false)
    })
})

describe('validateImageRequest', () => {
    test('returns error when width is missing', () => {
        const errors = validateImageRequest({ height: 200 })
        expect(errors.some((e) => e.field === 'width')).toBe(true)
    })

    test('returns error when height is missing', () => {
        const errors = validateImageRequest({ width: 400 })
        expect(errors.some((e) => e.field === 'height')).toBe(true)
    })

    test('returns error when width is out of range', () => {
        const errors = validateImageRequest({ width: 5000, height: 200 })
        expect(errors.some((e) => e.field === 'width' && e.message.includes('4096'))).toBe(true)
    })

    test('returns error when height is out of range', () => {
        const errors = validateImageRequest({ width: 400, height: 0 })
        expect(errors.some((e) => e.field === 'height')).toBe(true)
    })

    test('returns error when text is too long', () => {
        const longText = 'a'.repeat(1001)
        const errors = validateImageRequest({ width: 400, height: 200, text: longText })
        expect(errors.some((e) => e.field === 'text')).toBe(true)
    })

    test('returns error when fontSize is out of range', () => {
        const errors = validateImageRequest({ width: 400, height: 200, fontSize: 5 })
        expect(errors.some((e) => e.field === 'fontSize')).toBe(true)
    })

    test('returns error when fontWeight is invalid', () => {
        const errors = validateImageRequest({ width: 400, height: 200, fontWeight: 450 })
        expect(errors.some((e) => e.field === 'fontWeight')).toBe(true)
    })

    test('returns error when color is invalid', () => {
        const errors = validateImageRequest({ width: 400, height: 200, color: 'invalid' })
        expect(errors.some((e) => e.field === 'color')).toBe(true)
    })

    test('returns no errors for valid request', () => {
        const errors = validateImageRequest({
            width: 400,
            height: 200,
            text: 'Hello',
            fontSize: 32,
            fontWeight: 400,
            color: '#000000',
            backgroundColor: '#ffffff',
        })
        expect(errors).toHaveLength(0)
    })
})

describe('parseQueryParams', () => {
    test('parses width and height correctly', () => {
        const result = parseQueryParams({ width: '400', height: '200' })
        expect(result.width).toBe(400)
        expect(result.height).toBe(200)
    })

    test('uses defaults for missing optional params', () => {
        const result = parseQueryParams({ width: '400', height: '200' })
        expect(result.text).toBe('')
        expect(result.font).toBe('sans-serif')
        expect(result.fontSize).toBe(32)
        expect(result.fontWeight).toBe(400)
        expect(result.color).toBe('#000000')
        expect(result.backgroundColor).toBe('#ffffff')
    })

    test('parses CSS JSON correctly', () => {
        const result = parseQueryParams({
            width: '400',
            height: '200',
            css: '{"borderRadius":"8px"}',
        })
        expect(result.css).toEqual({ borderRadius: '8px' })
    })

    test('handles invalid CSS JSON gracefully', () => {
        const result = parseQueryParams({
            width: '400',
            height: '200',
            css: 'invalid-json',
        })
        expect(result.css).toEqual({})
    })
})
