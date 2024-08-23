import { localStorage } from '@/utils'
import { light, dark } from '@/styles/themes'

export function useDark() {
  const saved = localStorage.get('prefer-dark')
  const isDark = ref(
    saved ||
      (saved == null &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
  )

  function updateTheme() {
    localStorage.set('prefer-dark', isDark.value)
    StyleProvider(isDark.value ? dark : light)
    document.documentElement.style.setProperty(
      'color-scheme',
      isDark.value ? 'dark' : 'light'
    )
    notify()
  }

  function toggleDark() {
    isDark.value = !isDark.value
    updateTheme()
  }

  function notify() {
    if (window.parent === window) {
      return
    }

    window.parent.postMessage(
      { type: 'theme-change', isDark: isDark.value },
      '*'
    )
  }

  updateTheme()

  return {
    isDark,
    toggleDark,
    updateTheme,
  }
}
