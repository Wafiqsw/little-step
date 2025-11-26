import React from "react";
import Svg, {
  Path,
  G,
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

export interface LogoProps {
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ width = 61, height = 50, ...props }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 61 50"
      fill="none"
      {...props}
    >
      <Path
        d="M22.744 38.3188V40.9188"
        stroke="#190C1E"
        strokeWidth={15.4762}
      />

      {/* filter removed */}
      <G>
        <Path
          d="M41.1155 31.819C41.1155 38.691 36.2016 39.6188 28.3968 39.6188C20.5919 39.6188 14.2649 34.0479 14.2649 27.1759C14.2649 20.304 15.5448 18.0762 23.3497 18.0762C31.1545 18.0762 26.7817 31.819 41.1155 31.819Z"
          fill="url(#paint0_linear)"
        />
      </G>

      <Path
        d="M24.5611 38.1333V41.4761"
        stroke="#190C1E"
        strokeWidth={15.4762}
      />

      <Path
        d="M47.7777 37.019L27.993 33.3766L32.079 25.1333L47.7777 37.019Z"
        fill="url(#paint1_linear)"
      />

      {/* Drop shadow filter removed */}
      <G>
        <Path
          d="M44.5476 33.142C5.18007 37.0427 35.059 20.6996 15.4762 20.6992C15.4762 20.6992 16.8894 13.0856 22.3403 16.2428C27.7912 19.3999 44.5476 33.142 44.5476 33.142Z"
          fill="url(#paint2_linear)"
        />
      </G>

      <Path
        d="M13.8611 19.9333L16.0819 19.1904L15.4762 20.6761L13.8611 19.9333Z"
        fill="#190C1E"
      />

      <Ellipse
        cx={19.1101}
        cy={17.7045}
        rx={0.807539}
        ry={0.742855}
        fill="white"
      />
      <Ellipse
        cx={18.7064}
        cy={17.7045}
        rx={0.807539}
        ry={0.742855}
        fill="#190C1E"
      />
      <Ellipse
        cx={18.1007}
        cy={17.519}
        rx={0.201885}
        ry={0.185714}
        fill={"#ECBBB4"}
      />

      <Defs>
        <LinearGradient
          id="paint0_linear"
          x1="19.5139"
          y1="28.8476"
          x2="27.2837"
          y2="40.2402"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#EF5DA8" />
          <Stop offset={1} stopColor="#ECE0B3" />
        </LinearGradient>

        <LinearGradient
          id="paint1_linear"
          x1="29.9285"
          y1="29.1591"
          x2="46.9167"
          y2="38.5728"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#F09E54" />
          <Stop offset={1} stopColor="#F8D08B" />
        </LinearGradient>

        <LinearGradient
          id="paint2_linear"
          x1="17.495"
          y1="17.1475"
          x2="43.3697"
          y2="35.2742"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FCDDEC" />
          <Stop offset={1} stopColor="#E7B4FF" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
