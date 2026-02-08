import { describe, test, expect } from 'bun:test'
import { IconGenerator } from '@components/icon-generator'

describe('IconGenerator', () => {
    test('renders without errors', () => {
        const element = IconGenerator()
        expect(element).toBeDefined()
    })

    test('contains width and height inputs', () => {
        const element = IconGenerator()
        const html = element.toString()
        expect(html).toContain('id="width"')
        expect(html).toContain('id="height"')
    })

    test('has default values', () => {
        const element = IconGenerator()
        const html = element.toString()
        expect(html).toContain('value="100"')
        expect(html).toContain('value="Hello"')
        expect(html).toContain('value="32"')
    })

    test('contains color picker popover components', () => {
        const element = IconGenerator()
        const html = element.toString()
        expect(html).toContain('id="color-trigger"')
        expect(html).toContain('id="color-preview"')
        expect(html).toContain('id="color-popover"')
        expect(html).toContain('id="color-native"')
        expect(html).toContain('sr-only')
    })

    test('contains font selection options', () => {
        const element = IconGenerator()
        const html = element.toString()
        expect(html).toContain('value="Inter"')
        expect(html).toContain('value="Noto Sans KR"')
    })

    test('contains font weight options', () => {
        const element = IconGenerator()
        const html = element.toString()
        expect(html).toContain('value="400"')
        expect(html).toContain('value="700"')
    })
})
