import { describe, test, expect } from 'bun:test'
import app from '../../server'

describe('GET /', () => {
    test('returns HTML page', async () => {
        const res = await app.request('/')
        expect(res.status).toBe(200)
        expect(res.headers.get('content-type')).toContain('text/html')
    })

    test('contains Icon Generator title', async () => {
        const res = await app.request('/')
        const html = await res.text()
        expect(html).toContain('<title>Icon Generator</title>')
    })

    test('contains settings form', async () => {
        const res = await app.request('/')
        const html = await res.text()
        expect(html).toContain('id="settings-form"')
        expect(html).toContain('id="width"')
        expect(html).toContain('id="height"')
        expect(html).toContain('id="text"')
    })

    test('contains preview section', async () => {
        const res = await app.request('/')
        const html = await res.text()
        expect(html).toContain('id="preview-image"')
        expect(html).toContain('id="preview-container"')
    })

    test('contains action buttons', async () => {
        const res = await app.request('/')
        const html = await res.text()
        expect(html).toContain('id="download-button"')
        expect(html).toContain('id="copy-url-button"')
        expect(html).toContain('id="copy-markdown-button"')
    })

    test('contains font selection', async () => {
        const res = await app.request('/')
        const html = await res.text()
        expect(html).toContain('id="font"')
        expect(html).toContain('id="googleFont"')
        expect(html).toContain('id="fontWeight"')
    })

    test('contains color picker popover components', async () => {
        const res = await app.request('/')
        const html = await res.text()
        expect(html).toContain('id="color-trigger"')
        expect(html).toContain('id="color-popover"')
        expect(html).toContain('id="backgroundColor-trigger"')
        expect(html).toContain('id="backgroundColor-popover"')
        expect(html).toContain('color-swatch')
    })

    test('contains tailwind and css inputs', async () => {
        const res = await app.request('/')
        const html = await res.text()
        expect(html).toContain('id="tailwind"')
        expect(html).toContain('id="css"')
    })

    test('loads client script', async () => {
        const res = await app.request('/')
        const html = await res.text()
        expect(html).toContain('src="/static/client.js"')
    })

    test('loads stylesheet', async () => {
        const res = await app.request('/')
        const html = await res.text()
        expect(html).toContain('href="/static/styles.built.css"')
    })

    test('contains error handling elements', async () => {
        const res = await app.request('/')
        const html = await res.text()
        expect(html).toContain('id="error-container"')
        expect(html).toContain('id="retry-button"')
        expect(html).toContain('id="validationErrors"')
    })

    test('has default preview image URL', async () => {
        const res = await app.request('/')
        const html = await res.text()
        expect(html).toContain('/api/image?width=100')
        expect(html).toContain('text=Hello')
    })
})

describe('GET /static/*', () => {
    test('serves client.js', async () => {
        const res = await app.request('/static/client.js')
        expect(res.status).toBe(200)
        expect(res.headers.get('content-type')).toContain('javascript')
    })

    test('serves styles.built.css', async () => {
        const res = await app.request('/static/styles.built.css')
        expect(res.status).toBe(200)
        expect(res.headers.get('content-type')).toContain('css')
    })

    test('returns 404 for non-existent files', async () => {
        const res = await app.request('/static/nonexistent.js')
        expect(res.status).toBe(404)
    })
})
