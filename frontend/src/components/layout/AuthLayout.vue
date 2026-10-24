<template>
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
    <!-- Background: 暖白基调 -->
    <div class="absolute inset-0 bg-[#FAF8F4] dark:bg-dark-950"></div>

    <!-- 细微暖橙氛围，克制不发光 -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        class="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-primary-100/60 dark:bg-primary-900/20"
      ></div>
      <div
        class="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-primary-50/80 dark:bg-primary-900/10"
      ></div>
      <!-- 顶部细线，SolYoung 编号式叙事 -->
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-200/70 to-transparent dark:via-primary-800/60"></div>
    </div>

    <!-- Content Container -->
    <div class="relative z-10 w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="mb-8 text-center">
        <template v-if="settingsLoaded">
          <div
            class="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl shadow-card"
          >
            <img :src="siteLogo || '/logo.svg'" alt="Logo" class="h-full w-full object-contain" />
          </div>
          <p
            class="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B0A99C] dark:text-dark-400"
          >
            {{ siteName }} / {{ currentYear }}
          </p>
          <h1 class="text-2xl font-bold tracking-tight text-[#25241F] dark:text-dark-50">
            {{ siteName }}
          </h1>
          <p class="mt-1.5 text-sm text-[#8F8779] dark:text-dark-400">
            {{ siteSubtitle }}
          </p>
        </template>
      </div>

      <!-- Card Container -->
      <div
        class="rounded-2xl border border-[#EFEAE1] bg-white p-8 shadow-card dark:border-dark-700 dark:bg-dark-800"
      >
        <slot />
      </div>

      <!-- Footer Links -->
      <div class="mt-6 text-center text-sm">
        <slot name="footer" />
      </div>

      <!-- Copyright -->
      <div class="mt-8 text-center text-xs text-[#B0A99C] dark:text-dark-500">
        &copy; {{ currentYear }} {{ siteName }}. All rights reserved.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/stores'
import { sanitizeUrl } from '@/utils/url'

const appStore = useAppStore()

const siteName = computed(() => appStore.siteName || 'SolAPI')
const siteLogo = computed(() => sanitizeUrl(appStore.siteLogo || '', { allowRelative: true, allowDataUrl: true }))
const siteSubtitle = computed(() => appStore.cachedPublicSettings?.site_subtitle || 'AI API Relay Platform')
const settingsLoaded = computed(() => appStore.publicSettingsLoaded)

const currentYear = computed(() => new Date().getFullYear())

onMounted(() => {
  appStore.fetchPublicSettings()
})
</script>
