import type { ImageRequest } from '../types'

type ImageTemplateProps = {
    request: ImageRequest
    computedStyles: Record<string, string | number>
    iconDataUrl?: string
}

export const ImageTemplate = ({ request, computedStyles, iconDataUrl }: ImageTemplateProps) => {
    const fontSize = request.fontSize ?? Math.round(request.height * 0.5)
    const iconSize = request.iconSize || Math.round(fontSize * 1.2)
    const gap = Math.round(request.height * 0.08)

    const containerStyle: Record<string, string | number> = {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: `${gap}px`,
        backgroundColor: request.backgroundColor,
        ...computedStyles,
    }

    const textStyle: Record<string, string | number> = {
        color: request.color,
        fontSize,
        fontWeight: request.fontWeight,
        fontFamily: request.font,
        lineHeight: 1.2,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    }

    return (
        <div style={containerStyle}>
            {iconDataUrl && <img src={iconDataUrl} width={iconSize} height={iconSize} style={{ objectFit: 'contain' }} />}
            {request.text && <span style={textStyle}>{request.text}</span>}
        </div>
    )
}
