import satori from 'satori'
import { initWasm, Resvg } from '@resvg/resvg-wasm'
import { readFile } from 'fs/promises'
import { join } from 'path'
import type { ImageRequest } from '#types/index'
import { ImageTemplate } from '@components/image-template'
import { loadFont } from '@services/fontLoader'
import { loadIcon, loadIconFromUrl } from '@services/iconLoader'
import { convertTailwindToCSS, mergeStyles } from '@utils/tailwindConverter'

let wasmInitialized = false

const initResvg = async () => {
    if (wasmInitialized) return
    const basePath = process.env.VERCEL ? '/var/task' : process.cwd()
    const wasmPath = join(basePath, 'node_modules/@resvg/resvg-wasm/index_bg.wasm')
    const wasmBuffer = await readFile(wasmPath)
    await initWasm(wasmBuffer)
    wasmInitialized = true
}

export const generateImage = async (request: ImageRequest): Promise<Buffer> => {
    await initResvg()

    const fontConfig = await loadFont(request.font, request.fontWeight)

    const fonts = fontConfig
        ? [
              {
                  name: fontConfig.name,
                  data: fontConfig.data,
                  weight: fontConfig.weight as 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
                  style: fontConfig.style as 'normal' | 'italic',
              },
          ]
        : []

    const tailwindStyles = convertTailwindToCSS(request.tailwind)
    const computedStyles = mergeStyles(tailwindStyles, request.css)

    let iconDataUrl: string | undefined
    if (request.iconUrl) {
        iconDataUrl = (await loadIconFromUrl(request.iconUrl)) ?? undefined
    } else if (request.icon) {
        iconDataUrl = (await loadIcon(request.icon)) ?? undefined
    }

    const svg = await satori(ImageTemplate({ request, computedStyles, iconDataUrl }), {
        width: request.width,
        height: request.height,
        fonts,
    })

    const resvg = new Resvg(svg, {
        fitTo: {
            mode: 'width',
            value: request.width,
        },
    })

    const pngData = resvg.render()
    return Buffer.from(pngData.asPng())
}
