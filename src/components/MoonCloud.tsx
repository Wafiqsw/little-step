import React from 'react'
import Svg, { Ellipse, Path, G, Rect, Defs, LinearGradient, Stop, Filter, FeFlood, FeBlend, FeColorMatrix, FeOffset, FeGaussianBlur, FeComposite } from 'react-native-svg'

export interface MoonCloudProps {
    width?: number
    height?: number
}

export const MoonCloud: React.FC<MoonCloudProps> = ({
    width = 375,
    height = 261,
    ...props
}) => {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 375 261"
            fill="none"
            {...props}
        >
            <Ellipse
                cx="125.5"
                cy="103.5"
                rx="101.5"
                ry="103.5"
                fill="url(#paint0_linear_0_1)"
            />
            <Path
                d="M165.018 174.766V187.487"
                stroke="#190C1E"
                strokeWidth="15.4762"
            />
            <G filter="url(#filter0_i_0_1)">
                <Path
                    d="M247.784 142.962C247.784 176.586 225.646 181.125 190.485 181.125C155.323 181.125 126.819 153.868 126.819 120.245C126.819 86.6212 132.585 75.7211 167.747 75.7211C202.908 75.7211 183.209 142.962 247.784 142.962Z"
                    fill="url(#paint1_linear_0_1)"
                />
            </G>
            <Path
                d="M173.204 173.857V190.213"
                stroke="#190C1E"
                strokeWidth="15.4762"
            />
            <Path
                d="M277.797 168.405L188.666 150.583L207.073 110.25L277.797 168.405Z"
                fill="url(#paint2_linear_0_1)"
            />
            <G filter="url(#filter1_d_0_1)">
                <Path
                    d="M263.245 149.436C85.891 168.522 220.498 88.5577 132.276 88.5558C132.276 88.5558 138.643 51.3041 163.199 66.7514C187.756 82.1987 263.245 149.436 263.245 149.436Z"
                    fill="url(#paint3_linear_0_1)"
                />
            </G>
            <Path
                d="M125 84.8078L135.005 81.1731L132.276 88.4424L125 84.8078Z"
                fill="#190C1E"
            />
            <Ellipse
                cx="148.647"
                cy="73.9041"
                rx="3.63804"
                ry="3.63466"
                fill="white"
            />
            <Ellipse
                cx="146.828"
                cy="73.9041"
                rx="3.63804"
                ry="3.63466"
                fill="#190C1E"
            />
            <Ellipse
                cx="144.1"
                cy="72.9955"
                rx="0.909509"
                ry="0.908665"
                fill="#ECBBB4"
            />
            <Rect
                x="11"
                y="38"
                width="52"
                height="20"
                rx="10"
                fill="white"
            />
            <Rect
                x="165"
                y="11"
                width="52"
                height="20"
                rx="10"
                fill="white"
            />
            <Rect
                x="160"
                y="26"
                width="63"
                height="20"
                rx="10"
                fill="white"
            />
            <Rect
                x="24"
                y="52"
                width="52"
                height="20"
                rx="10"
                fill="white"
            />
            <Ellipse
                cx="198.5"
                cy="242.5"
                rx="213.5"
                ry="50.5"
                fill="url(#paint4_linear_0_1)"
            />

            <Defs>
                <Filter
                    id="filter0_i_0_1"
                    x="126.819"
                    y="75.7211"
                    width="136.441"
                    height="120.88"
                    filterUnits="userSpaceOnUse"
                >
                    <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                    <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <FeOffset dx="15.4762" dy="15.4762" />
                    <FeGaussianBlur stdDeviation="15.4762" />
                    <FeComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <FeColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.29 0" />
                    <FeBlend mode="normal" in2="shape" result="effect1_innerShadow_0_1" />
                </Filter>

                <Filter
                    id="filter1_d_0_1"
                    x="116.8"
                    y="47.5238"
                    width="161.922"
                    height="120.332"
                    filterUnits="userSpaceOnUse"
                >
                    <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                    <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <FeOffset />
                    <FeGaussianBlur stdDeviation="7.73809" />
                    <FeComposite in2="hardAlpha" operator="out" />
                    <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1" />
                    <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape" />
                </Filter>

                <LinearGradient
                    id="paint0_linear_0_1"
                    x1="125"
                    y1="-6"
                    x2="125.5"
                    y2="207"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#FCDDEC" />
                    <Stop offset="0.967969" stopColor="white" stopOpacity="0" />
                </LinearGradient>

                <LinearGradient
                    id="paint1_linear_0_1"
                    x1="150.466"
                    y1="128.424"
                    x2="189.528"
                    y2="181.16"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#EF5DA8" />
                    <Stop offset="1" stopColor="#ECE0B3" />
                </LinearGradient>

                <LinearGradient
                    id="paint2_linear_0_1"
                    x1="197.385"
                    y1="129.948"
                    x2="276.757"
                    y2="170.445"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#F09E54" />
                    <Stop offset="1" stopColor="#F8D08B" />
                </LinearGradient>

                <LinearGradient
                    id="paint3_linear_0_1"
                    x1="141.371"
                    y1="71.178"
                    x2="264.088"
                    y2="150.336"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#FCDDEC" />
                    <Stop offset="1" stopColor="#E7B4FF" />
                </LinearGradient>

                <LinearGradient
                    id="paint4_linear_0_1"
                    x1="263.736"
                    y1="277.304"
                    x2="264.207"
                    y2="166.714"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#FCDDEC" />
                    <Stop offset="1" stopColor="#AEAFF7" />
                </LinearGradient>
            </Defs>
        </Svg>
    )
}
