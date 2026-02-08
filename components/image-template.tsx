import type { ImageRequest } from '../types'

type ImageTemplateProps = {
    request: ImageRequest
    computedStyles: Record<string, string | number>
    iconDataUrl?: string
}

export const ImageTemplate = ({ request, computedStyles, iconDataUrl }: ImageTemplateProps) => {
    const containerStyle: Record<string, string | number> = {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        backgroundColor: request.backgroundColor,
        ...computedStyles,
    }

    const textStyle: Record<string, string | number> = {
        color: request.color,
        fontSize: request.fontSize,
        fontWeight: request.fontWeight,
        fontFamily: request.font,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    }

    const iconSize = request.iconSize > 0 ? request.iconSize : Math.min(request.height * 0.6, request.fontSize * 1.5)

    return (
        <div style={containerStyle}>
            {iconDataUrl && <img src={iconDataUrl} width={iconSize} height={iconSize} style={{ objectFit: 'contain' }} />}
            {request.text && <span style={textStyle}>{request.text}</span>}
        </div>
    )
}
