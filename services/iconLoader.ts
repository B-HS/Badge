import { readFile, readdir } from 'fs/promises'
import { join } from 'path'

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

export const loadIconFromUrl = async (url: string): Promise<string | null> => {
    if (iconCache.has(url)) {
        return iconCache.get(url)!
    }

    try {
        const response = await fetch(url)
        if (!response.ok) return null

        const contentType = response.headers.get('content-type') || 'image/svg+xml'
        const buffer = await response.arrayBuffer()
        const base64 = Buffer.from(buffer).toString('base64')
        const dataUrl = `data:${contentType};base64,${base64}`
        iconCache.set(url, dataUrl)
        return dataUrl
    } catch {
        return null
    }
}
