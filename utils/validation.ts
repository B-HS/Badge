import type { ImageRequest, ValidationError } from '@types/index'

const SIZE_MIN = 1
const SIZE_MAX = 4096
const FONT_SIZE_MIN = 8
const FONT_SIZE_MAX = 500
const TEXT_MAX_LENGTH = 1000
const VALID_FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900]

const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
const CSS_COLOR_NAMES = [
    'black',
    'white',
    'red',
    'green',
    'blue',
    'yellow',
    'cyan',
    'magenta',
    'gray',
    'grey',
    'orange',
    'pink',
    'purple',
    'brown',
    'transparent',
]

export const isValidColor = (color: string) => {
    return HEX_COLOR_REGEX.test(color) || CSS_COLOR_NAMES.includes(color.toLowerCase())
}

export const validateImageRequest = (params: Partial<ImageRequest>): ValidationError[] => {
    const errors: ValidationError[] = []

    if (params.width === undefined || params.width === null) {
        errors.push({ field: 'width', message: 'Width is required' })
    } else if (typeof params.width !== 'number' || !Number.isInteger(params.width)) {
        errors.push({ field: 'width', message: 'Width must be an integer' })
    } else if (params.width < SIZE_MIN || params.width > SIZE_MAX) {
        errors.push({ field: 'width', message: `Width must be between ${SIZE_MIN} and ${SIZE_MAX}` })
    }

    if (params.height === undefined || params.height === null) {
        errors.push({ field: 'height', message: 'Height is required' })
    } else if (typeof params.height !== 'number' || !Number.isInteger(params.height)) {
        errors.push({ field: 'height', message: 'Height must be an integer' })
    } else if (params.height < SIZE_MIN || params.height > SIZE_MAX) {
        errors.push({ field: 'height', message: `Height must be between ${SIZE_MIN} and ${SIZE_MAX}` })
    }

    if (params.text !== undefined && typeof params.text === 'string' && params.text.length > TEXT_MAX_LENGTH) {
        errors.push({ field: 'text', message: `Text must be ${TEXT_MAX_LENGTH} characters or less` })
    }

    if (params.fontSize !== undefined) {
        if (typeof params.fontSize !== 'number') {
            errors.push({ field: 'fontSize', message: 'Font size must be a number' })
        } else if (params.fontSize < FONT_SIZE_MIN || params.fontSize > FONT_SIZE_MAX) {
            errors.push({ field: 'fontSize', message: `Font size must be between ${FONT_SIZE_MIN} and ${FONT_SIZE_MAX}` })
        }
    }

    if (params.fontWeight !== undefined) {
        if (!VALID_FONT_WEIGHTS.includes(params.fontWeight)) {
            errors.push({ field: 'fontWeight', message: `Font weight must be one of: ${VALID_FONT_WEIGHTS.join(', ')}` })
        }
    }

    if (params.color !== undefined && !isValidColor(params.color)) {
        errors.push({ field: 'color', message: 'Invalid color format. Use hex (#fff or #ffffff) or CSS color name' })
    }

    if (params.backgroundColor !== undefined && !isValidColor(params.backgroundColor)) {
        errors.push({ field: 'backgroundColor', message: 'Invalid color format. Use hex (#fff or #ffffff) or CSS color name' })
    }

    return errors
}

export const parseQueryParams = (query: Record<string, string | undefined>): Partial<ImageRequest> => {
    const result: Partial<ImageRequest> = {}

    if (query.width !== undefined) {
        const parsed = parseInt(query.width, 10)
        result.width = isNaN(parsed) ? undefined : parsed
    }

    if (query.height !== undefined) {
        const parsed = parseInt(query.height, 10)
        result.height = isNaN(parsed) ? undefined : parsed
    }

    result.text = query.text ?? ''
    result.font = query.font ?? 'sans-serif'

    if (query.fontSize !== undefined) {
        const parsed = parseInt(query.fontSize, 10)
        result.fontSize = isNaN(parsed) ? 32 : parsed
    } else {
        result.fontSize = 32
    }

    if (query.fontWeight !== undefined) {
        const parsed = parseInt(query.fontWeight, 10)
        result.fontWeight = isNaN(parsed) ? 400 : parsed
    } else {
        result.fontWeight = 400
    }

    result.color = query.color ?? '#000000'
    result.backgroundColor = query.backgroundColor ?? '#ffffff'
    result.tailwind = query.tailwind ?? ''

    if (query.css) {
        try {
            result.css = JSON.parse(query.css)
        } catch {
            result.css = {}
        }
    } else {
        result.css = {}
    }

    return result
}
