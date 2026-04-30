// @ts-check

import { defineConfig } from 'steiger'
import fsd from '@feature-sliced/steiger-plugin'

export default defineConfig([
  // Включаем рекомендованные правила FSD
  ...fsd.configs.recommended,

  // Мягкий режим на этап MVP
  {
    rules: {
      // пока допускаем временные cross-import в entities
      'fsd/forbidden-imports': 'warn',
      // на старте слайсы еще без ui/model/api сегментов
      'fsd/no-segmentless-slices': 'warn',
      // каркасные слайсы могут пока не использоваться
      'fsd/insignificant-slice': 'warn',
    },
  },

  // Опционально: отключаем правило публичного API для shared (там он не всегда нужен)
  {
    files: ['./src/shared/**'],
    rules: {
      'fsd/public-api': 'off',
    },
  },

  // Игнорируем сборку и зависимости
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
])
