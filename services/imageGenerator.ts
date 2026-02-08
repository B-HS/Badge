import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import type { ImageRequest } from '#types/index'
import { ImageTemplate } from '@components/image-template'
import { loadFont } from '@services/fontLoader'
import { convertTailwindToCSS, mergeStyles } from '@utils/tailwindConverter'

export const generateImage = async (request: ImageRequest): Promise<Buffer> => {
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
