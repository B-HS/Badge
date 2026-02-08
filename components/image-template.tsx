import type { ImageRequest } from '../types'

type ImageTemplateProps = {
    request: ImageRequest
    computedStyles: Record<string, string | number>
}

export const ImageTemplate = ({ request, computedStyles }: ImageTemplateProps) => {
    const containerStyle: Record<string, string | number> = {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        maxWidth: '90%',
    }

    return <div style={containerStyle}>{request.text && <span style={textStyle}>{request.text}</span>}</div>
}
