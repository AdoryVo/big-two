
import type { Theme } from '@utils/theme'
import {
  DEFAULT_THEME, getThemeOption, setThemeOption,
} from '@utils/theme'
import _ from 'lodash'
import { useEffect, useState } from 'react'

export function useTheme(): [Theme, (update: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME)

  // Need to have an empty dependency list here, because object comparison
  // doesn't work in JS - we use lodash.isEqual to compare and prevent
  // infinite update loops instead; this way, we will only call setTheme
  // if it has been updated in local storage.
  /* eslint-disable-next-line react-hooks/exhaustive-deps*/
  useEffect(() => {
    // Set theme from local storage
    const localStorageTheme = {
      cardTheme: getThemeOption('cardTheme'),
      colorScheme: getThemeOption('colorScheme'),
    }

    if (!_.isEqual(theme, localStorageTheme)) {
      setTheme({
        cardTheme: getThemeOption('cardTheme'),
        colorScheme: getThemeOption('colorScheme'),
      })
    }
  })

  function updateTheme(update: Theme) {
    setTheme(update)
    // Set local storage from update
    for (const option in update) {
      setThemeOption(option, update[option])
    }
  }

  return [theme, updateTheme]
}
