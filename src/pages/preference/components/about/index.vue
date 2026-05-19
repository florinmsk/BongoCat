<script setup lang="ts">
import { emit } from '@tauri-apps/api/event'
import { appLogDir } from '@tauri-apps/api/path'
import { openPath } from '@tauri-apps/plugin-opener'
import { Button } from 'antdv-next'
import { computed, onMounted, ref } from 'vue'

import ProListItem from '@/components/pro-list-item/index.vue'
import ProList from '@/components/pro-list/index.vue'
import { LISTEN_KEY } from '@/constants'
import { useAppStore } from '@/stores/app'
import { useModelStore } from '@/stores/model'

const appStore = useAppStore()
const modelStore = useModelStore()
const logDir = ref('')

onMounted(async () => {
  logDir.value = await appLogDir()
})

const currentModelLabel = computed(() => {
  const mode = modelStore.currentModel?.mode
  if (!mode) return '—'
  return `pages.preference.about.models.${mode}`
})

const installedModelsCount = computed(() => modelStore.models.length)

function handleUpdate() {
  emit(LISTEN_KEY.UPDATE_APP)
}
</script>

<template>
  <ProList :title="$t('pages.preference.about.labels.aboutApp')">
    <div class="b-1 b-solid p-6 bg-elevated b-border-sec rounded-lg flex items-center gap-4">
      <img
        src="/logo.png"
        alt="BongoCat"
        class="w-16 h-16 rounded-xl shrink-0"
      >

      <div class="flex-1 min-w-0">
        <div class="text-5 font-semibold leading-tight">
          {{ appStore.name }}
        </div>
        <div class="text-3.5 color-text-tertiary mt-1">
          {{ $t('pages.preference.about.info.version') }} {{ appStore.version }}
        </div>
        <div class="text-3 color-text-tertiary mt-0.5">
          Florin Meșca (florinmsk)
        </div>
      </div>

      <Button
        type="primary"
        @click="handleUpdate"
      >
        {{ $t('pages.preference.about.buttons.checkUpdate') }}
      </Button>
    </div>

    <ProListItem :title="$t('pages.preference.about.info.activeModel')">
      <span class="color-text-secondary">
        {{ $t(currentModelLabel) }}
      </span>
    </ProListItem>

    <ProListItem :title="$t('pages.preference.about.info.installedModels')">
      <span class="color-text-secondary">{{ installedModelsCount }}</span>
    </ProListItem>

    <ProListItem
      :description="logDir"
      :title="$t('pages.preference.about.labels.appLog')"
    >
      <Button @click="openPath(logDir)">
        {{ $t('pages.preference.about.buttons.viewLog') }}
      </Button>
    </ProListItem>
  </ProList>
</template>
