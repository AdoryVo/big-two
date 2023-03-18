import { useEffect, useState } from 'react'

import {
  DEFAULT_THEME,
  Theme,
  getThemeOption,
  setThemeOption,
} from '@utils/theme'

export function useTheme(): [Theme, (update: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME)

  useEffect(() => {
    // Set theme from local storage
    setTheme({
      cardTheme: getThemeOption('cardTheme'),
      colorScheme: getThemeOption('colorScheme'),
    })
  }, [])

  function updateTheme(update: Theme) {
    setTheme(update)
    // Set local storage from update
    for (const option in update) {
      setThemeOption(option, update[option])
    }
  }

  return [theme, updateTheme]
}
