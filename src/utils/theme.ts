// Card Theme
export const enum CardTheme {
  Classic = 'classic',
  Paul = 'paul'
}

export const CardThemes = [CardTheme.Classic, CardTheme.Paul]

export function setCardTheme(theme: string) {
  localStorage.setItem('cardTheme', theme)
}

export function getCardTheme() {
  return localStorage.getItem('cardTheme') || CardTheme.Classic
}

// Color Schemes
// https://chakra-ui.com/docs/styled-system/theme#colors
export const enum ColorScheme {
  Classic = 'classic',
  Dark = 'dark',
}

export const ColorSchemes = [ColorScheme.Classic, ColorScheme.Dark]

export const COLOR_SCHEME_STYLES: { [scheme: string]: any } = {
  [ColorScheme.Classic]: {
    bg: { backgroundColor: '#C6F6D5' },
    text: {},
  },
  [ColorScheme.Dark]: {
    bg: { backgroundColor: '#36393E' },
    text: { color: '#C3B1E1' },
  },
}

export function setColorScheme(theme: string) {
  localStorage.setItem('colorScheme', theme)
}

export function getColorScheme() {
  return localStorage.getItem('colorScheme') || ColorScheme.Classic
}
