export const enum Theme {
  Classic = 'classic',
  Paul = 'paul'
}

export const Themes = [Theme.Classic, Theme.Paul]

export function setTheme(theme: string) {
  localStorage.setItem('theme', theme)
}

export function getTheme() {
  return localStorage.getItem('theme') || Theme.Classic
}
