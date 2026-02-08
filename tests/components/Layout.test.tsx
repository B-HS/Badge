import { describe, test, expect } from 'bun:test'
import { Layout } from '@components/layout'

describe('Layout', () => {
    test('renders with children', () => {
        const element = Layout({ children: <div>Test Content</div> })
        expect(element).toBeDefined()
    })

    test('contains html lang attribute', () => {
        const element = Layout({ children: null })
        const html = element.toString()
        expect(html).toContain('lang="ko"')
    })

    test('contains meta viewport', () => {
        const element = Layout({ children: null })
        const html = element.toString()
        expect(html).toContain('name="viewport"')
    })

    test('contains title', () => {
        const element = Layout({ children: null })
        const html = element.toString()
        expect(html).toContain('<title>Icon Generator</title>')
    })

    test('loads stylesheet', () => {
        const element = Layout({ children: null })
        const html = element.toString()
        expect(html).toContain('href="/static/styles.built.css"')
    })

    test('loads client script as module', () => {
        const element = Layout({ children: null })
        const html = element.toString()
        expect(html).toContain('type="module"')
        expect(html).toContain('src="/static/client.js"')
    })

    test('has app container', () => {
        const element = Layout({ children: null })
        const html = element.toString()
        expect(html).toContain('id="app"')
    })
})
