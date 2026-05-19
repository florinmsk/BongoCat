<script setup lang="ts">
import { emit } from '@tauri-apps/api/event'
import { appLogDir } from '@tauri-apps/api/path'
import { openPath } from '@tauri-apps/plugin-opener'
import { Button, message, Modal, Spin } from 'antdv-next'
import dayjs from 'dayjs'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import VueMarkdown from 'vue-markdown-render'

import ProListItem from '@/components/pro-list-item/index.vue'
import ProList from '@/components/pro-list/index.vue'
import { GITHUB_LINK, LISTEN_KEY } from '@/constants'
import { useAppStore } from '@/stores/app'
import { useModelStore } from '@/stores/model'

interface Release {
  id: number
  tag_name: string
  name: string | null
  published_at: string
  body: string | null
  html_url: string
}

const { t } = useI18n()
const appStore = useAppStore()
const modelStore = useModelStore()
const logDir = ref('')

const changelogOpen = ref(false)
const changelogLoading = ref(false)
const releases = ref<Release[]>([])

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

async function openChangelog() {
  changelogOpen.value = true

  if (releases.value.length > 0) return

  changelogLoading.value = true

  try {
    const apiUrl = GITHUB_LINK.replace('https://github.com/', 'https://api.github.com/repos/') + '/releases'
    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    releases.value = await response.json()
  } catch (error) {
    message.error(`${t('pages.preference.about.hints.changelogLoadError')} ${String(error)}`)
  } finally {
    changelogLoading.value = false
  }
}

function formatDate(iso: string) {
  return dayjs(iso).format('YYYY-MM-DD')
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

    <ProListItem :title="$t('pages.preference.about.labels.changelog')">
      <Button @click="openChangelog">
        {{ $t('pages.preference.about.buttons.viewChangelog') }}
      </Button>
    </ProListItem>
  </ProList>

  <Modal
    v-model:open="changelogOpen"
    :title="$t('pages.preference.about.labels.changelog')"
    :footer="null"
    width="640"
    centered
  >
    <Spin :spinning="changelogLoading">
      <div
        v-if="!changelogLoading && releases.length === 0"
        class="text-center color-text-tertiary py-8"
      >
        {{ $t('pages.preference.about.hints.noReleases') }}
      </div>

      <div class="max-h-[60vh] overflow-auto changelog-list">
        <div
          v-for="release in releases"
          :key="release.id"
          class="b-b-1 b-b-solid b-border-sec py-4 last:b-b-0"
        >
          <div class="flex items-baseline gap-2 mb-1">
            <span class="text-4 font-semibold">{{ release.name || release.tag_name }}</span>
            <span class="text-3 color-text-tertiary">{{ formatDate(release.published_at) }}</span>
          </div>
          <VueMarkdown
            v-if="release.body"
            class="changelog-body color-text-secondary text-3.5"
            :source="release.body"
          />
          <div
            v-else
            class="color-text-tertiary italic text-3.5"
          >
            {{ $t('components.updateApp.hints.noChangelog') }}
          </div>
        </div>
      </div>
    </Spin>
  </Modal>
</template>

<style lang="scss" scoped>
.changelog-body {
  :not(a) {
    all: revert;
  }
}
</style>
