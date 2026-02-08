export type ImageRequest = {
    width: number
    height: number
    text: string
    font: string
    fontSize: number
    fontWeight: number
    color: string
    backgroundColor: string
    tailwind: string
    css: Record<string, string | number>
}

export type CachedImage = {
    cacheKey: string
    imageData: Buffer
    createdAt: number
    size: number
}

export type FontConfig = {
    name: string
    data: ArrayBuffer
    weight: number
    style: 'normal' | 'italic'
    source: 'local' | 'google'
}

export type FontInfo = {
    name: string
    weights: number[]
}

export type ValidationError = {
    field: string
    message: string
}
