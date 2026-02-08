import satori from 'satori'
import { initWasm, Resvg } from '@resvg/resvg-wasm'
import { readFile } from 'fs/promises'
import { join } from 'path'
import type { ImageRequest } from '#types/index'
import { ImageTemplate } from '@components/image-template'
import { loadFont } from '@services/fontLoader'
import { convertTailwindToCSS, mergeStyles } from '@utils/tailwindConverter'

let wasmInitialized = false

const initResvg = async () => {
    if (wasmInitialized) return
    const wasmPath = join(process.cwd(), 'node_modules/@resvg/resvg-wasm/index_bg.wasm')
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

    const svg = await satori(ImageTemplate({ request, computedStyles }), {
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
