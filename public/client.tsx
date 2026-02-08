type ImageConfig = {
    width: number
    height: number
    text: string
    font: string
    fontSize: number
    fontWeight: number
    color: string
    backgroundColor: string
    icon: string
    iconUrl: string
    iconSize: number
    tailwind: string
    css: string
}

type ValidationError = {
    field: string
    message: string
}

const DEFAULT_CONFIG: ImageConfig = {
    width: 800,
    height: 250,
    text: 'Badge',
    font: 'Inter',
    fontSize: 32,
    fontWeight: 400,
    color: '#000000',
    backgroundColor: '#ffffff',
    icon: '',
    iconUrl: '',
    iconSize: 0,
    tailwind: '',
    css: '',
}

const AVAILABLE_ICONS = ['ts', 'js', 'react', 'vue', 'svelte', 'next', 'nuxt', 'node', 'express', 'java', 'spring', 'docker', 'git', 'github', 'linux', 'sass', 'tailwind', 'jenkins']

const debounce = <T extends (...args: Parameters<T>) => void>(fn: T, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn(...args), delay)
    }
}

const validate = (config: ImageConfig): ValidationError[] => {
    const errors: ValidationError[] = []

    if (config.width < 1 || config.width > 4096 || !Number.isInteger(config.width)) {
        errors.push({ field: 'width', message: 'Width must be an integer between 1 and 4096' })
    }
    if (config.height < 1 || config.height > 4096 || !Number.isInteger(config.height)) {
        errors.push({ field: 'height', message: 'Height must be an integer between 1 and 4096' })
    }
    if (config.text.length > 1000) {
        errors.push({ field: 'text', message: 'Text must be 1000 characters or less' })
    }
    if (config.fontSize < 8 || config.fontSize > 500) {
        errors.push({ field: 'fontSize', message: 'Font size must be between 8 and 500' })
    }

    if (config.css) {
        try {
            JSON.parse(config.css)
        } catch {
            errors.push({ field: 'css', message: 'Invalid JSON format' })
        }
    }

    return errors
}

const buildQueryParams = (config: ImageConfig) => {
    const params = new URLSearchParams()
    params.set('width', String(config.width))
    params.set('height', String(config.height))
    params.set('text', config.text)
    params.set('font', config.font)
    if (config.fontSize > 0) params.set('fontSize', String(config.fontSize))
    params.set('fontWeight', String(config.fontWeight))
    params.set('color', config.color)
    params.set('backgroundColor', config.backgroundColor)
    if (config.icon) params.set('icon', config.icon)
    if (config.iconUrl) params.set('iconUrl', config.iconUrl)
    params.set('iconSize', String(config.iconSize))
    if (config.tailwind) params.set('tailwind', config.tailwind)
    if (config.css) params.set('css', config.css)
    return params
}

const buildApiUrl = (config: ImageConfig) => `/api/image?${buildQueryParams(config).toString()}&_t=${Date.now()}`

const buildFullUrl = (config: ImageConfig) => `${window.location.origin}${buildApiUrl(config)}`

const setupColorPicker = (
    id: string,
    initialValue: string,
    onChange: (color: string) => void
) => {
    const trigger = document.getElementById(`${id}-trigger`) as HTMLButtonElement
    const preview = document.getElementById(`${id}-preview`) as HTMLDivElement
    const valueDisplay = document.getElementById(`${id}-value`) as HTMLSpanElement
    const nativeInput = document.getElementById(`${id}-native`) as HTMLInputElement
    const popover = document.getElementById(`${id}-popover`) as HTMLDivElement
    const textInput = document.getElementById(`${id}-input`) as HTMLInputElement
    const eyedropper = document.getElementById(`${id}-eyedropper`) as HTMLButtonElement
    const swatches = document.querySelectorAll(`.${id}-swatch`) as NodeListOf<HTMLButtonElement>

    let currentColor = initialValue
    let isOpen = false

    const updateUI = (color: string) => {
        currentColor = color
        preview.style.backgroundColor = color
        valueDisplay.textContent = color
        textInput.value = color
        nativeInput.value = color
        onChange(color)
    }

    const openPopover = () => {
        popover.classList.remove('hidden')
        isOpen = true
    }

    const closePopover = () => {
        popover.classList.add('hidden')
        isOpen = false
    }

    trigger.onclick = (e) => {
        e.stopPropagation()
        if (isOpen) {
            closePopover()
        } else {
            openPopover()
        }
    }

    popover.onclick = (e) => e.stopPropagation()

    swatches.forEach((swatch) => {
        swatch.onclick = () => {
            const color = swatch.dataset.color
            if (color) {
                updateUI(color)
            }
        }
    })

    textInput.oninput = () => {
        const value = textInput.value
        if (/^#[0-9A-Fa-f]{6}$/.test(value) || /^#[0-9A-Fa-f]{3}$/.test(value)) {
            updateUI(value)
        }
    }

    textInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
            closePopover()
        }
    }

    nativeInput.oninput = () => {
        updateUI(nativeInput.value)
    }

    if ('EyeDropper' in window) {
        eyedropper.onclick = async () => {
            try {
                const eyeDropper = new (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper()
                const result = await eyeDropper.open()
                updateUI(result.sRGBHex)
            } catch {
                nativeInput.click()
            }
        }
    } else {
        eyedropper.onclick = () => nativeInput.click()
    }

    return { close: closePopover, getValue: () => currentColor }
}

const init = () => {
    const widthInput = document.getElementById('width') as HTMLInputElement
    const heightInput = document.getElementById('height') as HTMLInputElement
    const textInput = document.getElementById('text') as HTMLInputElement
    const fontSizeInput = document.getElementById('fontSize') as HTMLInputElement
    const fontSelect = document.getElementById('font') as HTMLSelectElement
    const googleFontInput = document.getElementById('googleFont') as HTMLInputElement
    const fontMessage = document.getElementById('fontMessage') as HTMLParagraphElement
    const fontWeightSelect = document.getElementById('fontWeight') as HTMLSelectElement
    const iconSelect = document.getElementById('icon') as HTMLSelectElement
    const iconUrlInput = document.getElementById('iconUrl') as HTMLInputElement
    const iconSizeInput = document.getElementById('iconSize') as HTMLInputElement
    const tailwindInput = document.getElementById('tailwind') as HTMLInputElement
    const cssTextarea = document.getElementById('css') as HTMLTextAreaElement
    const cssError = document.getElementById('cssError') as HTMLParagraphElement
    const validationErrors = document.getElementById('validationErrors') as HTMLDivElement
    const previewImage = document.getElementById('preview-image') as HTMLImageElement
    const loadingSpinner = document.getElementById('loading-spinner') as HTMLDivElement
    const errorContainer = document.getElementById('error-container') as HTMLDivElement
    const retryButton = document.getElementById('retry-button') as HTMLButtonElement
    const downloadButton = document.getElementById('download-button') as HTMLButtonElement
    const copyUrlButton = document.getElementById('copy-url-button') as HTMLButtonElement
    const copyMarkdownButton = document.getElementById('copy-markdown-button') as HTMLButtonElement
    const copyFeedback = document.getElementById('copy-feedback') as HTMLParagraphElement

    let config: ImageConfig = { ...DEFAULT_CONFIG }
    let useGoogleFont = false

    const showLoading = () => {
        loadingSpinner.classList.remove('hidden')
        previewImage.classList.add('hidden')
        errorContainer.classList.add('hidden')
    }

    const showImage = () => {
        loadingSpinner.classList.add('hidden')
        previewImage.classList.remove('hidden')
        errorContainer.classList.add('hidden')
    }

    const showError = () => {
        loadingSpinner.classList.add('hidden')
        previewImage.classList.add('hidden')
        errorContainer.classList.remove('hidden')
    }

    const showValidationErrors = (errors: ValidationError[]) => {
        if (errors.length === 0) {
            validationErrors.classList.add('hidden')
            return
        }
        validationErrors.classList.remove('hidden')
        validationErrors.querySelector('div')!.innerHTML = errors.map((e) => `<p>${e.message}</p>`).join('')
    }

    const showCssFeedback = (error: boolean) => {
        if (error) {
            cssError.textContent = 'Invalid JSON format'
            cssError.classList.remove('hidden')
        } else {
            cssError.classList.add('hidden')
        }
    }

    const updatePreview = async () => {
        const errors = validate(config)
        showValidationErrors(errors)
        showCssFeedback(config.css !== '' && errors.some((e) => e.field === 'css'))

        if (errors.length > 0) return

        showLoading()

        const url = buildApiUrl(config)
        try {
            const response = await fetch(url)
            if (!response.ok) {
                showError()
                return
            }
            const blob = await response.blob()
            previewImage.src = URL.createObjectURL(blob)
            showImage()
        } catch {
            showError()
        }
    }

    const debouncedUpdatePreview = debounce(updatePreview, 300)

    retryButton.onclick = updatePreview

    const syncConfig = () => {
        config = {
            ...config,
            width: parseInt(widthInput.value) || 100,
            height: parseInt(heightInput.value) || 100,
            text: textInput.value,
            font: useGoogleFont && googleFontInput.value ? googleFontInput.value : fontSelect.value,
            fontSize: fontSizeInput.value ? parseInt(fontSizeInput.value) : 0,
            fontWeight: parseInt(fontWeightSelect.value) || 400,
            icon: iconUrlInput.value ? '' : iconSelect.value,
            iconUrl: iconUrlInput.value,
            iconSize: iconSizeInput.value ? parseInt(iconSizeInput.value) : 0,
            tailwind: tailwindInput.value,
            css: cssTextarea.value,
        }
        debouncedUpdatePreview()
    }

    const colorPicker = setupColorPicker('color', '#000000', (color) => {
        config.color = color
        debouncedUpdatePreview()
    })

    const bgColorPicker = setupColorPicker('backgroundColor', '#ffffff', (color) => {
        config.backgroundColor = color
        debouncedUpdatePreview()
    })

    document.addEventListener('click', () => {
        colorPicker.close()
        bgColorPicker.close()
    })

    widthInput.oninput = syncConfig
    heightInput.oninput = syncConfig
    textInput.oninput = syncConfig
    fontSizeInput.oninput = syncConfig
    tailwindInput.oninput = syncConfig
    cssTextarea.oninput = syncConfig
    fontWeightSelect.onchange = syncConfig
    iconSelect.onchange = syncConfig
    iconUrlInput.oninput = syncConfig
    iconSizeInput.oninput = syncConfig

    fontSelect.onchange = () => {
        useGoogleFont = false
        googleFontInput.value = ''
        fontMessage.classList.add('hidden')
        syncConfig()
    }

    googleFontInput.oninput = () => {
        if (googleFontInput.value) {
            useGoogleFont = true
            fontMessage.textContent = `Using Google Font: ${googleFontInput.value}`
            fontMessage.classList.remove('hidden')
            fontMessage.className = 'mt-1.5 text-sm text-primary'
        } else {
            useGoogleFont = false
            fontMessage.classList.add('hidden')
        }
        syncConfig()
    }

    const showFeedback = (message: string, success: boolean) => {
        copyFeedback.textContent = message
        copyFeedback.className = `mt-2 text-sm ${success ? 'text-green-600' : 'text-destructive'}`
        copyFeedback.classList.remove('hidden')
        setTimeout(() => copyFeedback.classList.add('hidden'), 2000)
    }

    downloadButton.onclick = async () => {
        try {
            const response = await fetch(buildApiUrl(config))
            const blob = await response.blob()
            const a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            a.download = 'icon.png'
            a.click()
            URL.revokeObjectURL(a.href)
        } catch {
            showFeedback('Failed to download', false)
        }
    }

    copyUrlButton.onclick = async () => {
        try {
            await navigator.clipboard.writeText(buildFullUrl(config))
            showFeedback('API URL copied!', true)
        } catch {
            showFeedback('Failed to copy', false)
        }
    }

    copyMarkdownButton.onclick = async () => {
        try {
            await navigator.clipboard.writeText(`![badge](${buildFullUrl(config)})`)
            showFeedback('Markdown copied!', true)
        } catch {
            showFeedback('Failed to copy', false)
        }
    }
}

document.addEventListener('DOMContentLoaded', init)
