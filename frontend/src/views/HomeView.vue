<template>
  <!-- Custom Home Content: Full Page Mode -->
  <div v-if="hasHomeContent" class="min-h-screen">
    <!-- iframe mode -->
    <iframe
      v-if="isHomeContentUrl"
      :src="homeContent.trim()"
      class="h-screen w-full border-0"
      allowfullscreen
    ></iframe>
    <!-- HTML mode - SECURITY: homeContent is admin-only setting, XSS risk is acceptable -->
    <div v-else v-html="homeContent"></div>
  </div>

  <!-- Compact Home Page -->
  <div
    v-else-if="compactHomeEnabled"
    data-testid="compact-home"
    class="flex min-h-screen flex-col bg-[#FAF8F4] text-[#25241F] dark:bg-dark-950 dark:text-dark-100"
  >
    <header class="border-b border-[#EFEAE1] px-4 py-4 sm:px-6 dark:border-dark-800">
      <nav class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div class="flex min-w-0 flex-1 items-center gap-3">
          <img
            :src="siteLogo || '/logo.svg'"
            alt="Logo"
            class="h-9 w-9 shrink-0 rounded-lg object-contain"
          />
          <span class="min-w-0 truncate text-base font-semibold">{{ siteName }}</span>
        </div>
        <div class="flex max-w-full shrink-0 flex-wrap items-center justify-end gap-2">
          <LocaleSwitcher />
          <a
            v-if="docUrl"
            :href="docUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#6E675F] hover:bg-[#F3F0EA] dark:text-dark-400 dark:hover:bg-dark-800"
            :title="t('home.viewDocs')"
          >
            <Icon name="book" size="md" />
          </a>
          <router-link
            v-if="showModelPlazaEntry"
            to="/model-plaza"
            class="flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-[#6E675F] hover:bg-[#F3F0EA] hover:text-[#25241F] dark:text-dark-400 dark:hover:bg-dark-800 dark:hover:text-dark-50"
            :title="t('nav.modelPlaza')"
          >
            <Icon name="grid" size="md" />
            <span class="hidden sm:inline">{{ t('nav.modelPlaza') }}</span>
          </router-link>
          <button
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#6E675F] hover:bg-[#F3F0EA] dark:text-dark-400 dark:hover:bg-dark-800"
            :title="isDark ? t('home.switchToLight') : t('home.switchToDark')"
            @click="toggleTheme"
          >
            <Icon v-if="isDark" name="sun" size="md" />
            <Icon v-else name="moon" size="md" />
          </button>
          <router-link
            :to="isAuthenticated ? dashboardPath : '/login'"
            class="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg bg-[#25241F] px-4 py-2 text-sm font-medium text-white hover:bg-[#3A362E] dark:bg-dark-50 dark:text-dark-950 dark:hover:bg-dark-200"
          >
            {{ isAuthenticated ? t('home.dashboard') : t('home.login') }}
          </router-link>
        </div>
      </nav>
    </header>

    <main class="flex min-w-0 flex-1 items-center justify-center px-4 py-16 sm:px-6">
      <div class="min-w-0 max-w-2xl text-center">
        <img
          :src="siteLogo || '/logo.svg'"
          alt="Logo"
          class="mx-auto mb-6 h-20 w-20 rounded-2xl object-contain"
        />
        <h1 class="[overflow-wrap:anywhere] text-3xl font-bold md:text-4xl">{{ siteName }}</h1>
        <p class="mt-4 whitespace-pre-wrap [overflow-wrap:anywhere] text-base text-[#6E675F] dark:text-dark-300">{{ siteSubtitle }}</p>
        <router-link
          :to="isAuthenticated ? dashboardPath : '/login'"
          class="mt-8 inline-flex min-h-10 items-center justify-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          {{ isAuthenticated ? t('home.goToDashboard') : t('home.login') }}
        </router-link>
      </div>
    </main>

    <footer class="min-w-0 border-t border-[#EFEAE1] px-4 py-5 text-center text-sm text-[#8F8779] [overflow-wrap:anywhere] sm:px-6 dark:border-dark-800 dark:text-dark-400">
      &copy; {{ currentYear }} {{ siteName }}
    </footer>
  </div>

  <!-- Default Home Page: SolYoung 风格落地页 -->
  <div
    v-else
    class="relative flex min-h-screen flex-col overflow-hidden bg-[#FAF8F4] text-[#25241F] dark:bg-dark-950 dark:text-dark-100"
  >
    <!-- 顶部品牌细线 -->
    <div class="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-primary-300/80 to-transparent dark:via-primary-700/70"></div>

    <!-- Header -->
    <header class="relative z-20 px-6 py-5">
      <nav class="mx-auto flex max-w-5xl items-center justify-between">
        <!-- Logo -->
        <router-link :to="isAuthenticated ? dashboardPath : '/'" class="flex items-center gap-2.5">
          <div class="h-9 w-9 overflow-hidden rounded-xl shadow-card">
            <img :src="siteLogo || '/logo.svg'" alt="Logo" class="h-full w-full object-contain" />
          </div>
          <span class="text-base font-semibold tracking-tight">{{ siteName }}</span>
        </router-link>

        <!-- Nav Actions -->
        <div class="flex items-center gap-2">
          <LocaleSwitcher />
          <a
            v-if="docUrl"
            :href="docUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-lg p-2 text-[#6E675F] transition-colors hover:bg-[#F3F0EA] hover:text-[#25241F] dark:text-dark-400 dark:hover:bg-dark-800 dark:hover:text-dark-50"
            :title="t('home.viewDocs')"
          >
            <Icon name="book" size="md" />
          </a>
          <router-link
            v-if="showModelPlazaEntry"
            to="/model-plaza"
            class="inline-flex items-center gap-1.5 rounded-lg p-2 text-sm text-[#6E675F] transition-colors hover:bg-[#F3F0EA] hover:text-[#25241F] dark:text-dark-400 dark:hover:bg-dark-800 dark:hover:text-dark-50"
            :title="t('nav.modelPlaza')"
          >
            <Icon name="grid" size="md" />
            <span class="hidden sm:inline">{{ t('nav.modelPlaza') }}</span>
          </router-link>
          <button
            @click="toggleTheme"
            class="rounded-lg p-2 text-[#6E675F] transition-colors hover:bg-[#F3F0EA] hover:text-[#25241F] dark:text-dark-400 dark:hover:bg-dark-800 dark:hover:text-dark-50"
            :title="isDark ? t('home.switchToLight') : t('home.switchToDark')"
          >
            <Icon v-if="isDark" name="sun" size="md" />
            <Icon v-else name="moon" size="md" />
          </button>

          <router-link
            v-if="isAuthenticated"
            :to="dashboardPath"
            class="ml-1 inline-flex items-center gap-2 rounded-full border border-[#E8E3DA] bg-white py-1 pl-1 pr-3 text-xs font-medium text-[#25241F] shadow-sm transition-colors hover:border-[#DCCFC0] hover:bg-[#FBF7F2] dark:border-dark-600 dark:bg-dark-800 dark:text-dark-100 dark:hover:border-dark-500"
          >
            <span
              class="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-semibold text-white"
            >
              {{ userInitial }}
            </span>
            {{ t('home.dashboard') }}
          </router-link>
          <router-link
            v-else
            to="/login"
            class="ml-1 inline-flex items-center rounded-full bg-[#25241F] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#3A362E] dark:bg-dark-50 dark:text-dark-950 dark:hover:bg-dark-200"
          >
            {{ t('home.login') }}
          </router-link>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="relative z-10 flex-1">
      <div class="mx-auto max-w-5xl px-6">
        <!-- Hero -->
        <section class="flex flex-col items-center pb-16 pt-16 text-center sm:pt-20">
          <p
            class="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#B0A99C] dark:text-dark-400"
          >
            {{ siteName }} / {{ currentYear }}
          </p>
          <h1
            class="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-[#25241F] dark:text-dark-50 md:text-5xl"
          >
            {{ t('home.heroSubtitle') }}
          </h1>
          <p class="mt-5 max-w-xl text-base leading-relaxed text-[#6E675F] dark:text-dark-300">
            {{ t('home.heroDescription') }}
          </p>
          <div class="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <router-link
              :to="isAuthenticated ? dashboardPath : '/register'"
              class="btn btn-primary px-7 py-3 text-base"
            >
              {{ isAuthenticated ? t('home.goToDashboard') : t('home.getStarted') }}
              <Icon name="arrowRight" size="md" :stroke-width="2" />
            </router-link>
            <a
              :href="githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-secondary px-7 py-3 text-base"
            >
              <Icon name="github" size="md" />
              {{ t('home.viewOnGithub') }}
            </a>
          </div>
        </section>

        <!-- Terminal -->
        <section class="flex justify-center pb-20">
          <div class="terminal-container w-full max-w-xl">
            <div class="terminal-window">
              <div class="terminal-header">
                <div class="terminal-buttons">
                  <span class="btn-close"></span>
                  <span class="btn-minimize"></span>
                  <span class="btn-maximize"></span>
                </div>
                <span class="terminal-title">curl {{ siteName }}</span>
              </div>
              <div class="terminal-body">
                <div class="code-line line-1">
                  <span class="code-prompt">$</span>
                  <span class="code-cmd">curl</span>
                  <span class="code-flag">-X POST</span>
                  <span class="code-url">/v1/chat/completions</span>
                </div>
                <div class="code-line line-2">
                  <span class="code-comment"># 路由到上游模型，统一计费</span>
                </div>
                <div class="code-line line-3">
                  <span class="code-success">200 OK</span>
                  <span class="code-response">{ "content": "Hello!" }</span>
                </div>
                <div class="code-line line-4">
                  <span class="code-prompt">$</span>
                  <span class="cursor"></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 能力标签 -->
        <section class="flex flex-wrap items-center justify-center gap-3 pb-20">
          <span
            v-for="tag in featureTags"
            :key="tag.label"
            class="inline-flex items-center gap-2 rounded-full border border-[#EFEAE1] bg-white px-4 py-2 text-sm text-[#4A453C] shadow-card dark:border-dark-700 dark:bg-dark-800 dark:text-dark-200"
          >
            <Icon :name="tag.icon" size="sm" class="text-primary-600" />
            {{ tag.label }}
          </span>
        </section>

        <!-- 01 核心能力 -->
        <section class="pb-20">
          <div class="mb-8 flex items-baseline gap-3">
            <span class="font-mono text-sm font-semibold text-primary-600">01</span>
            <h2 class="text-2xl font-bold tracking-tight text-[#25241F] dark:text-dark-50">
              {{ t('home.solutions.title') }}
            </h2>
          </div>
          <div class="grid gap-5 md:grid-cols-3">
            <div
              v-for="(feature, idx) in featureCards"
              :key="feature.title"
              class="group rounded-2xl border border-[#EFEAE1] bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E3D9CC] hover:shadow-card-hover dark:border-dark-700 dark:bg-dark-800"
            >
              <div
                class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition-transform duration-300 group-hover:scale-105 dark:bg-primary-900/30 dark:text-primary-300"
              >
                <Icon :name="feature.icon" size="lg" />
              </div>
              <p class="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B0A99C] dark:text-dark-400">
                0{{ idx + 1 }}
              </p>
              <h3 class="mb-2 text-lg font-semibold text-[#25241F] dark:text-dark-50">
                {{ feature.title }}
              </h3>
              <p class="text-sm leading-relaxed text-[#6E675F] dark:text-dark-400">
                {{ feature.desc }}
              </p>
            </div>
          </div>
        </section>

        <!-- 02 已支持的模型 -->
        <section class="pb-20">
          <div class="mb-8 flex items-baseline gap-3">
            <span class="font-mono text-sm font-semibold text-primary-600">02</span>
            <h2 class="text-2xl font-bold tracking-tight text-[#25241F] dark:text-dark-50">
              {{ t('home.providers.title') }}
            </h2>
          </div>
          <p class="-mt-4 mb-7 text-sm text-[#8F8779] dark:text-dark-400">
            {{ t('home.providers.description') }}
          </p>
          <div class="flex flex-wrap items-center gap-3">
            <div
              v-for="provider in providerPills"
              :key="provider.label"
              class="flex items-center gap-2.5 rounded-xl border border-[#EFEAE1] bg-white px-4 py-2.5 shadow-card dark:border-dark-700 dark:bg-dark-800"
              :class="provider.soon ? 'opacity-55' : ''"
            >
              <span
                class="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
                :style="{ backgroundColor: provider.color }"
              >
                {{ provider.badge }}
              </span>
              <span class="text-sm font-medium text-[#4A453C] dark:text-dark-200">{{ provider.label }}</span>
              <span
                v-if="!provider.soon"
                class="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                >{{ t('home.providers.supported') }}</span
              >
              <span
                v-else
                class="rounded-full bg-[#F3F1EC] px-2 py-0.5 text-[10px] font-medium text-[#8F8779] dark:bg-dark-700 dark:text-dark-400"
                >{{ t('home.providers.soon') }}</span
              >
            </div>
          </div>
        </section>

        <!-- 03 开始使用 -->
        <section class="pb-24">
          <div
            class="rounded-3xl border border-primary-100 bg-gradient-to-b from-primary-50/80 to-white p-8 sm:p-12 dark:border-primary-900/40 dark:from-primary-900/20 dark:to-dark-800"
          >
            <div class="mb-8 flex items-baseline gap-3">
              <span class="font-mono text-sm font-semibold text-primary-600">03</span>
              <h2 class="text-2xl font-bold tracking-tight text-[#25241F] dark:text-dark-50">
                {{ t('home.cta.title') }}
              </h2>
            </div>
            <p class="-mt-5 mb-8 text-sm text-[#6E675F] dark:text-dark-400">
              {{ t('home.cta.description') }}
            </p>
            <div class="grid gap-4 sm:grid-cols-3">
              <div
                v-for="(step, idx) in gettingStartedSteps"
                :key="step.title"
                class="rounded-2xl border border-[#EFEAE1] bg-white p-5 dark:border-dark-700 dark:bg-dark-800"
              >
                <p class="mb-2 font-mono text-xs font-semibold text-primary-600">0{{ idx + 1 }}</p>
                <h3 class="mb-1.5 text-sm font-semibold text-[#25241F] dark:text-dark-50">
                  {{ step.title }}
                </h3>
                <p class="text-xs leading-relaxed text-[#8F8779] dark:text-dark-400">
                  {{ step.desc }}
                </p>
              </div>
            </div>
            <div class="mt-9 flex flex-col items-center gap-3 sm:flex-row">
              <router-link
                :to="isAuthenticated ? dashboardPath : '/register'"
                class="btn btn-primary px-7 py-3 text-base"
              >
                {{ isAuthenticated ? t('home.goToDashboard') : t('home.cta.button') }}
                <Icon name="arrowRight" size="md" :stroke-width="2" />
              </router-link>
              <router-link
                v-if="!isAuthenticated"
                to="/login"
                class="text-sm font-medium text-primary-700 transition-colors hover:text-primary-600 dark:text-primary-300"
              >
                {{ t('home.login') }} →
              </router-link>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-[#EFEAE1] px-6 py-8 dark:border-dark-800">
      <div
        class="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left"
      >
        <p class="text-sm text-[#8F8779] dark:text-dark-400">
          &copy; {{ currentYear }} {{ siteName }}. {{ t('home.footer.allRightsReserved') }}
        </p>
        <div class="flex items-center gap-5">
          <a
            v-if="docUrl"
            :href="docUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-[#8F8779] transition-colors hover:text-[#25241F] dark:text-dark-400 dark:hover:text-dark-50"
          >
            {{ t('home.docs') }}
          </a>
          <a
            :href="githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-[#8F8779] transition-colors hover:text-[#25241F] dark:text-dark-400 dark:hover:text-dark-50"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore, useAppStore } from '@/stores'
import LocaleSwitcher from '@/components/common/LocaleSwitcher.vue'
import Icon from '@/components/icons/Icon.vue'
import { sanitizeUrl } from '@/utils/url'
import { FeatureFlags, isFeatureFlagEnabled } from '@/utils/featureFlags'

const { t } = useI18n()

const authStore = useAuthStore()
const appStore = useAppStore()

// Site settings - directly from appStore (already initialized from injected config)
const siteName = computed(() => appStore.cachedPublicSettings?.site_name || appStore.siteName || 'SolAPI')
const siteLogo = computed(() => sanitizeUrl(appStore.cachedPublicSettings?.site_logo || appStore.siteLogo || '', { allowRelative: true, allowDataUrl: true }))
const siteSubtitle = computed(() => appStore.cachedPublicSettings?.site_subtitle || 'AI API Relay Platform')
const docUrl = computed(() => sanitizeUrl(appStore.cachedPublicSettings?.doc_url || appStore.docUrl || ''))
const homeContent = computed(() => appStore.cachedPublicSettings?.home_content || '')
const hasHomeContent = computed(() => homeContent.value.trim().length > 0)
const compactHomeEnabled = computed(() => appStore.cachedPublicSettings?.compact_home_enabled === true)
const modelPlazaEnabled = computed(() => isFeatureFlagEnabled(FeatureFlags.modelPlaza))

// Check if homeContent is a URL (for iframe display)
const isHomeContentUrl = computed(() => {
  const content = homeContent.value.trim()
  return content.startsWith('http://') || content.startsWith('https://')
})

// Theme
const isDark = ref(document.documentElement.classList.contains('dark'))

// GitHub URL（本项目开源地址）
const githubUrl = 'https://github.com/SolYoung-Ai/solapi'

// Auth state
const isAuthenticated = computed(() => authStore.isAuthenticated)
const modelPlazaRequiresAuth = computed(
  () => appStore.cachedPublicSettings?.model_plaza_require_auth === true,
)
const showModelPlazaEntry = computed(
  () => modelPlazaEnabled.value && (isAuthenticated.value || !modelPlazaRequiresAuth.value),
)
const isAdmin = computed(() => authStore.isAdmin)
const dashboardPath = computed(() => isAdmin.value ? '/admin/dashboard' : '/dashboard')
const userInitial = computed(() => {
  const user = authStore.user
  if (!user || !user.email) return ''
  return user.email.charAt(0).toUpperCase()
})

// Current year for footer
const currentYear = computed(() => new Date().getFullYear())

// 落地页能力标签
const featureTags = computed(() => [
  { label: t('home.tags.subscriptionToApi'), icon: 'swap' as const },
  { label: t('home.tags.stickySession'), icon: 'shield' as const },
  { label: t('home.tags.realtimeBilling'), icon: 'chart' as const },
])

// 落地页核心能力卡片
const featureCards = computed(() => [
  { title: t('home.features.unifiedGateway'), desc: t('home.features.unifiedGatewayDesc'), icon: 'server' as const },
  { title: t('home.features.multiAccount'), desc: t('home.features.multiAccountDesc'), icon: 'users' as const },
  { title: t('home.features.balanceQuota'), desc: t('home.features.balanceQuotaDesc'), icon: 'chart' as const },
])

// 已支持模型（仅展示项目实际支持的上游）
const providerPills = computed(() => [
  { label: t('home.providers.claude'), badge: 'C', color: '#D97757', soon: false },
  { label: 'GPT', badge: 'G', color: '#3B6E5C', soon: false },
  { label: t('home.providers.gemini'), badge: 'G', color: '#4A6FA5', soon: false },
  { label: t('home.providers.antigravity'), badge: 'A', color: '#A94725', soon: false },
  { label: t('home.providers.more'), badge: '+', color: '#8F8779', soon: true },
])

// 开始使用步骤
const gettingStartedSteps = computed(() => [
  { title: t('home.gettingStarted.step1Title'), desc: t('home.gettingStarted.step1Desc') },
  { title: t('home.gettingStarted.step2Title'), desc: t('home.gettingStarted.step2Desc') },
  { title: t('home.gettingStarted.step3Title'), desc: t('home.gettingStarted.step3Desc') },
])

// Toggle theme
function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// Initialize theme
function initTheme() {
  const savedTheme = localStorage.getItem('theme')
  if (
    savedTheme === 'dark' ||
    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
}

onMounted(() => {
  initTheme()

  // Check auth state
  authStore.checkAuth()

  // Ensure public settings are loaded (will use cache if already loaded from injected config)
  if (!appStore.publicSettingsLoaded) {
    appStore.fetchPublicSettings()
  }
})
</script>

<style scoped>
/* Terminal Container */
.terminal-container {
  position: relative;
  display: inline-block;
  width: 100%;
}

/* Terminal Window */
.terminal-window {
  width: 100%;
  background: linear-gradient(145deg, #2B2823 0%, #1B1915 100%);
  border-radius: 14px;
  box-shadow:
    0 20px 45px -14px rgba(30, 20, 12, 0.35),
    0 0 0 1px rgba(217, 106, 54, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;
  transform: perspective(1000px) rotateX(1.5deg) rotateY(-1.5deg);
  transition: transform 0.3s ease;
}

.terminal-window:hover {
  transform: perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(-3px);
}

/* Terminal Header */
.terminal-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: rgba(43, 40, 35, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.terminal-buttons {
  display: flex;
  gap: 8px;
}

.terminal-buttons span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.btn-close {
  background: #ef4444;
}
.btn-minimize {
  background: #eab308;
}
.btn-maximize {
  background: #22c55e;
}

.terminal-title {
  flex: 1;
  text-align: center;
  font-size: 12px;
  font-family: ui-monospace, monospace;
  color: #8F8779;
  margin-right: 52px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Terminal Body */
.terminal-body {
  padding: 20px 24px;
  font-family: ui-monospace, 'Fira Code', monospace;
  font-size: 14px;
  line-height: 2;
}

.code-line {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  opacity: 0;
  animation: line-appear 0.5s ease forwards;
}

.line-1 {
  animation-delay: 0.3s;
}
.line-2 {
  animation-delay: 1s;
}
.line-3 {
  animation-delay: 1.8s;
}
.line-4 {
  animation-delay: 2.5s;
}

@keyframes line-appear {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.code-prompt {
  color: #D96A36;
  font-weight: bold;
}
.code-cmd {
  color: #F6E3D0;
}
.code-flag {
  color: #E3A878;
}
.code-url {
  color: #EDC6A4;
}
.code-comment {
  color: #766E64;
  font-style: italic;
}
.code-success {
  color: #34d399;
  background: rgba(52, 211, 153, 0.15);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}
.code-response {
  color: #F6C98F;
}

/* Blinking Cursor */
.cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  background: #D96A36;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .code-line {
    animation: none;
    opacity: 1;
  }
  .cursor {
    animation: none;
    opacity: 1;
  }
  .terminal-window,
  .terminal-window:hover {
    transform: none;
  }
}
</style>
