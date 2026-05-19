import type { Locale as AntdLocale } from 'antdv-next/dist/locale/index'

import antdEnUS from 'antdv-next/locale/en_US'
import antdRoRO from 'antdv-next/locale/ro_RO'
import { createI18n } from 'vue-i18n'

import type { Language } from '@/stores/general'

import { LANGUAGE } from '@/constants'

import enUS from './en-US.json'
import roRO from './ro-RO.json'

export const i18n = createI18n({
  legacy: false,
  locale: LANGUAGE.RO_RO,
  fallbackLocale: LANGUAGE.RO_RO,
  messages: {
    [LANGUAGE.RO_RO]: roRO,
    [LANGUAGE.EN_US]: enUS,
  },
})

export function getAntdLocale(language: Language = LANGUAGE.RO_RO) {
  const antdLanguage: Record<Language, AntdLocale> = {
    [LANGUAGE.RO_RO]: antdRoRO,
    [LANGUAGE.EN_US]: antdEnUS,
  }

  return antdLanguage[language]
}
