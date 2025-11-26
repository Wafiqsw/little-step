import { TextStyle } from 'react-native'

export const FontFamily = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
  // Add custom fonts here when you add them to the project
  // regular: 'YourFont-Regular',
  // medium: 'YourFont-Medium',
  // bold: 'YourFont-Bold',
}

export const FontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
}

export const FontWeight = {
  light: '300' as TextStyle['fontWeight'],
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extrabold: '800' as TextStyle['fontWeight'],
}

export const LineHeight = {
  xs: 14,
  sm: 16,
  base: 20,
  md: 22,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 40,
  '5xl': 48,
}

export const LetterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1,
}

export const Typography = {
  // Display styles
  display: {
    large: {
      fontFamily: FontFamily.bold,
      fontSize: FontSize['5xl'],
      lineHeight: LineHeight['5xl'],
      fontWeight: FontWeight.bold,
    },
    medium: {
      fontFamily: FontFamily.bold,
      fontSize: FontSize['4xl'],
      lineHeight: LineHeight['4xl'],
      fontWeight: FontWeight.bold,
    },
    small: {
      fontFamily: FontFamily.bold,
      fontSize: FontSize['3xl'],
      lineHeight: LineHeight['3xl'],
      fontWeight: FontWeight.bold,
    },
  },

  // Heading styles
  heading: {
    h1: {
      fontFamily: FontFamily.bold,
      fontSize: FontSize['3xl'],
      lineHeight: LineHeight['3xl'],
      fontWeight: FontWeight.bold,
    },
    h2: {
      fontFamily: FontFamily.bold,
      fontSize: FontSize['2xl'],
      lineHeight: LineHeight['2xl'],
      fontWeight: FontWeight.bold,
    },
    h3: {
      fontFamily: FontFamily.bold,
      fontSize: FontSize.xl,
      lineHeight: LineHeight.xl,
      fontWeight: FontWeight.semibold,
    },
    h4: {
      fontFamily: FontFamily.bold,
      fontSize: FontSize.lg,
      lineHeight: LineHeight.lg,
      fontWeight: FontWeight.semibold,
    },
    h5: {
      fontFamily: FontFamily.medium,
      fontSize: FontSize.md,
      lineHeight: LineHeight.md,
      fontWeight: FontWeight.medium,
    },
    h6: {
      fontFamily: FontFamily.medium,
      fontSize: FontSize.base,
      lineHeight: LineHeight.base,
      fontWeight: FontWeight.medium,
    },
  },

  // Body styles
  body: {
    large: {
      fontFamily: FontFamily.regular,
      fontSize: FontSize.md,
      lineHeight: LineHeight.md,
      fontWeight: FontWeight.regular,
    },
    medium: {
      fontFamily: FontFamily.regular,
      fontSize: FontSize.base,
      lineHeight: LineHeight.base,
      fontWeight: FontWeight.regular,
    },
    small: {
      fontFamily: FontFamily.regular,
      fontSize: FontSize.sm,
      lineHeight: LineHeight.sm,
      fontWeight: FontWeight.regular,
    },
  },

  // Label styles
  label: {
    large: {
      fontFamily: FontFamily.medium,
      fontSize: FontSize.md,
      lineHeight: LineHeight.md,
      fontWeight: FontWeight.medium,
    },
    medium: {
      fontFamily: FontFamily.medium,
      fontSize: FontSize.base,
      lineHeight: LineHeight.base,
      fontWeight: FontWeight.medium,
    },
    small: {
      fontFamily: FontFamily.medium,
      fontSize: FontSize.sm,
      lineHeight: LineHeight.sm,
      fontWeight: FontWeight.medium,
    },
  },

  // Caption/Helper text
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    fontWeight: FontWeight.regular,
  },

  // Button text
  button: {
    large: {
      fontFamily: FontFamily.bold,
      fontSize: FontSize.md,
      lineHeight: LineHeight.md,
      fontWeight: FontWeight.semibold,
      letterSpacing: LetterSpacing.wide,
    },
    medium: {
      fontFamily: FontFamily.bold,
      fontSize: FontSize.base,
      lineHeight: LineHeight.base,
      fontWeight: FontWeight.semibold,
      letterSpacing: LetterSpacing.wide,
    },
    small: {
      fontFamily: FontFamily.bold,
      fontSize: FontSize.sm,
      lineHeight: LineHeight.sm,
      fontWeight: FontWeight.semibold,
      letterSpacing: LetterSpacing.wide,
    },
  },
}
