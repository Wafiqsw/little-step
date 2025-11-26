import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

export const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 768,
  isLargeDevice: width >= 768,
}

export const Breakpoints = {
  xs: 0,
  sm: 375,
  md: 768,
  lg: 1024,
  xl: 1280,
}

export const Container = {
  maxWidth: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  padding: {
    horizontal: 16,
    vertical: 16,
  },
}

export const Grid = {
  columns: 12,
  gutter: 16,
}
