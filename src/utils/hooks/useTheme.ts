import { useEffect, useState } from 'react'

import {
  COLOR_SCHEME_STYLES, CardTheme, CardThemes, ColorScheme,
  ColorSchemes, getCardTheme,
  getColorScheme, setCardTheme, setColorScheme,
} from '@utils/theme'

// export function useTheme() {
//   const [localCardTheme, setLocalCardTheme] = useState<string>(CardTheme.Classic)
//   const [localColorScheme, setLocalColorScheme] = useState<string>(ColorScheme.Dark)

//   useEffect(() => {
//     setLocalCardTheme(getCardTheme())
//     setLocalColorScheme(getColorScheme())
//   }, [])

//   return [localCardTheme, localColorScheme]
// }

export function useColorScheme() {
  const [localColorScheme, setLocalColorScheme] = useState<string>(ColorScheme.Dark)

  useEffect(() => {
    setLocalColorScheme(getColorScheme())
  }, [])

  function handleChangeColor(value: string) {
    setColorScheme(value)
    setLocalColorScheme(value)
  }

  return {
    localColorScheme,
    handleChangeColor,
  }
}
