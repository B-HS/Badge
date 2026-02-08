import { readFile, readdir } from 'fs/promises'
import { join } from 'path'
import { parseICO } from 'icojs'

const basePath = process.env.VERCEL ? '/var/task' : process.cwd()
const ICON_DIR = join(basePath, 'public', 'icon')

const iconCache = new Map<string, string>()
let availableIcons: string[] = []

export const loadAvailableIcons = async () => {
    if (availableIcons.length > 0) return availableIcons
    try {
        const files = await readdir(ICON_DIR)
        availableIcons = files
            .filter((f) => f.endsWith('.svg') || f.endsWith('.png'))
            .map((f) => f.replace(/\.(svg|png)$/, ''))
        return availableIcons
    } catch {
        return []
    }
}

export const loadIcon = async (name: string): Promise<string | null> => {
    if (iconCache.has(name)) {
        return iconCache.get(name)!
    }

    const svgPath = join(ICON_DIR, `${name}.svg`)
    const pngPath = join(ICON_DIR, `${name}.png`)

    try {
        const buffer = await readFile(svgPath)
        const dataUrl = `data:image/svg+xml;base64,${buffer.toString('base64')}`
        iconCache.set(name, dataUrl)
        return dataUrl
    } catch {
        try {
            const buffer = await readFile(pngPath)
            const dataUrl = `data:image/png;base64,${buffer.toString('base64')}`
            iconCache.set(name, dataUrl)
            return dataUrl
        } catch {
            return null
        }
    }
}

const sanitizeSvg = (svgContent: string): string => {
    let svg = svgContent
        .replace(/<\?xml[^>]*\?>/gi, '')
        .replace(/<!DOCTYPE[^>]*>/gi, '')
        .trim()

    if (!svg.includes('xmlns=')) {
        svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
    }

    if (!svg.includes('viewBox')) {
        const widthMatch = svg.match(/width=["']?(\d+(?:\.\d+)?)(px)?["']?/i)
        const heightMatch = svg.match(/height=["']?(\d+(?:\.\d+)?)(px)?["']?/i)
        if (widthMatch && heightMatch) {
            const width = parseFloat(widthMatch[1])
            const height = parseFloat(heightMatch[1])
            svg = svg.replace('<svg', `<svg viewBox="0 0 ${width} ${height}"`)
        }
    }

    return svg
}

const convertIcoToPng = async (buffer: ArrayBuffer): Promise<ArrayBuffer | null> => {
    try {
        const images = await parseICO(buffer, 'image/png')
        if (images.length === 0) return null
        const largest = images.reduce((a, b) => (a.width > b.width ? a : b))
        return largest.buffer
    } catch {
        return null
    }
}

const detectMimeType = (buffer: ArrayBuffer, contentType: string, url: string): string => {
    const bytes = new Uint8Array(buffer)

    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
        return 'image/png'
    }
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
        return 'image/jpeg'
    }
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
        return 'image/gif'
    }
    if (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01 && bytes[3] === 0x00) {
        return 'image/x-icon'
    }
    if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
        return 'image/webp'
    }

    const text = Buffer.from(buffer).toString('utf-8').trim()
    if (text.startsWith('<svg') || text.startsWith('<?xml') || text.includes('<svg')) {
        return 'image/svg+xml'
    }

    if (url.endsWith('.svg')) return 'image/svg+xml'
    if (url.endsWith('.png')) return 'image/png'
    if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg'
    if (url.endsWith('.gif')) return 'image/gif'
    if (url.endsWith('.ico')) return 'image/x-icon'
    if (url.endsWith('.webp')) return 'image/webp'

    return contentType || 'image/png'
}

export const loadIconFromUrl = async (url: string): Promise<string | null> => {
    if (iconCache.has(url)) {
        return iconCache.get(url)!
    }

    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        const response = await fetch(url, {
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 Badge-Generator/1.0' },
        })
        clearTimeout(timeoutId)

        if (!response.ok) return null

        const contentType = response.headers.get('content-type') || ''
        let buffer = await response.arrayBuffer()
        let mimeType = detectMimeType(buffer, contentType, url)

        if (mimeType === 'image/x-icon') {
            const pngBuffer = await convertIcoToPng(buffer)
            if (pngBuffer) {
                buffer = pngBuffer
                mimeType = 'image/png'
            }
        }

        if (mimeType === 'image/svg+xml') {
            const svgText = Buffer.from(buffer).toString('utf-8')
            const sanitized = sanitizeSvg(svgText)
            const base64 = Buffer.from(sanitized).toString('base64')
            const dataUrl = `data:${mimeType};base64,${base64}`
            iconCache.set(url, dataUrl)
            return dataUrl
        }

        const base64 = Buffer.from(buffer).toString('base64')
        const dataUrl = `data:${mimeType};base64,${base64}`
        iconCache.set(url, dataUrl)
        return dataUrl
    } catch {
        return null
    }
}
