import { defineStore } from 'pinia'
import { getLocale } from 'tauri-plugin-locale-api'
import { reactive, ref } from 'vue'

import { LANGUAGE } from '@/constants'

export type Theme = 'auto' | 'light' | 'dark'
export type Language = typeof LANGUAGE[keyof typeof LANGUAGE]

export interface GeneralStore {
  app: {
    autostart: boolean
    taskbarVisible: boolean
    trayVisible: boolean
  }
  appearance: {
    theme: Theme
    isDark: boolean
    language?: Language
  }
  update: {
    autoCheck: boolean
  }
}

export const useGeneralStore = defineStore('general', () => {
  /* ------------ Câmpuri deprecate (de eliminat) ------------ */

  /** @deprecated folosește `update.autoCheck` */
  const autoCheckUpdate = ref(false)

  /** @deprecated folosește `app.autostart` */
  const autostart = ref(false)

  /** @deprecated folosește `app.taskbarVisible` */
  const taskbarVisibility = ref(false)

  /** @deprecated folosește `appearance.theme` */
  const theme = ref<'auto' | Theme>('auto')

  /** @deprecated folosește `appearance.isDark` */
  const isDark = ref(false)

  /** @deprecated marchează dacă datele au fost migrate; va fi eliminat în versiunile viitoare */
  const migrated = ref(false)

  const app = reactive<GeneralStore['app']>({
    autostart: false,
    taskbarVisible: false,
    trayVisible: true,
  })

  const appearance = reactive<GeneralStore['appearance']>({
    theme: 'auto',
    isDark: false,
  })

  const update = reactive<GeneralStore['update']>({
    autoCheck: false,
  })

  const getLanguage = async () => {
    const locale = await getLocale<Language>()

    if (Object.values(LANGUAGE).includes(locale)) {
      return locale
    }

    return LANGUAGE.RO_RO
  }

  const init = async () => {
    if (!appearance.language || !Object.values(LANGUAGE).includes(appearance.language)) {
      appearance.language = await getLanguage()
    }

    if (migrated.value) return

    app.autostart = autostart.value
    app.taskbarVisible = taskbarVisibility.value

    appearance.theme = theme.value
    appearance.isDark = isDark.value

    update.autoCheck = autoCheckUpdate.value

    migrated.value = true
  }

  return {
    migrated,
    app,
    appearance,
    update,
    init,
  }
})
