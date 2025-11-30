import React from 'react'
import Svg, { Rect } from 'react-native-svg'

export type CloudVariant = 'left' | 'right'

export interface WhiteCloudProps {
    width?: number
    height?: number
    variant?: CloudVariant
}

export const WhiteCloud: React.FC<WhiteCloudProps> = ({
    width = 112,
    height = 128,
    variant = 'right',
    ...props
}) => {
    // Right cloud (original design - cloud positioned on right)
    if (variant === 'right') {
        return (
            <Svg
                width={width}
                height={height}
                viewBox="0 0 112 128"
                fill="none"
                {...props}
            >
                <Rect
                    y="49"
                    width="195"
                    height="79"
                    rx="39.5"
                    fill="#FFFFFF"
                />
                <Rect
                    x="46"
                    width="129"
                    height="74"
                    rx="37"
                    fill="#FFFFFF"
                />
            </Svg>
        )
    }

    // Left cloud (new design - cloud positioned on left)
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 122 136"
            fill="none"
            {...props}
        >
            <Rect
                x="-116"
                width="183"
                height="73"
                rx="36.5"
                fill="#FFFFFF"
            />
            <Rect
                x="-57"
                y="53"
                width="179"
                height="83"
                rx="41.5"
                fill="#FFFFFF"
            />
        </Svg>
    )
}
