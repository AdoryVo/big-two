import type { BoxProps } from '@chakra-ui/react'

// Types
/** Values correspond to the card assets in `/public/assets/cards`. */
export const enum CardTheme {
  Classic = 'classic',
  Paul = 'paul'
}

export const enum ColorScheme {
  Classic = 'classic',
  Night = 'night',
  Seafoam = 'seafoam',
  Casino = 'casino'
}

export interface Theme {
  [option: string]: string;
  cardTheme: string;
  colorScheme: string;
}

// Constants
/// Chakra Colors: https://chakra-ui.com/docs/styled-system/theme#colors
interface Styles {
  bg: BoxProps,
  text: BoxProps,
}

export const COLOR_SCHEME_STYLES: { [scheme: string]: Styles } = {
  [ColorScheme.Classic]: {
    bg: { bgGradient: 'radial(green.500, green.900)' },
    text: { color: 'gray.100', textShadow: '1px 2px black' },
  },
  [ColorScheme.Night]: {
    bg: { bgGradient: 'radial(#5E636C, #36393E)' },
    text: { color: 'purple.200', textShadow: '1px 1.5px black' },
  },
  [ColorScheme.Seafoam]: {
    bg: { bgGradient: 'radial(green.100, blue.200)' },
    text: { color: 'gray.600' },
  },
  [ColorScheme.Casino]: {
    bg: { bgGradient: 'radial(red.500, red.900)' },
    text: { color: 'gray.200', textShadow: '1px 2px black' },
  },
}

export const THEME_OPTIONS = {
  cardTheme: [CardTheme.Classic, CardTheme.Paul],
  colorScheme: [
    ColorScheme.Classic,
    ColorScheme.Night,
    ColorScheme.Seafoam,
    ColorScheme.Casino,
  ],
}

export const DEFAULT_THEME: Theme = {
  cardTheme: CardTheme.Classic,
  colorScheme: ColorScheme.Classic,
}

// Functions
export function setThemeOption(option: string, value: string) {
  localStorage.setItem(option, value)
}

export function getThemeOption(option: string) {
  return localStorage.getItem(option) || DEFAULT_THEME[option]
}

export function getStyles(theme: Theme) {
  const scheme = theme.colorScheme

  // Return default styles if scheme does not match
  if (!COLOR_SCHEME_STYLES.hasOwnProperty(scheme)) {
    return COLOR_SCHEME_STYLES[DEFAULT_THEME.colorScheme]
  }

  return COLOR_SCHEME_STYLES[scheme]
}
