<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NConfigProvider,
  NGlobalStyle,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NMenu,
  NButton,
  NSpace,
  NText,
} from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

// Public routes render without the app shell
const isPublicRoute = computed(() =>
  ['login', 'register'].includes(route.name as string),
)

const menuOptions = computed<MenuOption[]>(() => {
  const options: MenuOption[] = [{ label: '會員中心', key: 'member' }]

  if (auth.isApproved) {
    options.push({ label: '資料列表', key: 'list' })
  }

  if (auth.isAdmin) {
    options.push(
      { label: '土地建物', key: 'admin-assets' },
      { label: '分權標籤', key: 'admin-roles' },
      { label: '稽核日誌', key: 'admin-logs' },
    )
  }

  return options
})

const activeMenuKey = computed(() => (route.name as string) ?? '')

function navigate(key: string) {
  router.push({ name: key })
}

async function signOut() {
  await auth.signOut()
  router.push({ name: 'login' })
}
</script>

<template>
  <n-config-provider>
    <n-global-style />

    <!-- Public pages: full-screen, no app shell -->
    <RouterView v-if="isPublicRoute" />

    <!-- Authenticated app shell -->
    <n-layout v-else style="min-height: 100vh">
      <n-layout-header
        bordered
        style="height: 56px; padding: 0 24px; display: flex; align-items: center; gap: 16px"
      >
        <span style="font-weight: 700; font-size: 18px; white-space: nowrap">168</span>
        <n-menu
          mode="horizontal"
          :options="menuOptions"
          :value="activeMenuKey"
          style="flex: 1"
          @update:value="navigate"
        />
        <n-space align="center" :size="12" style="flex-shrink: 0">
          <n-text depth="3" style="font-size: 13px">{{ auth.user?.email }}</n-text>
          <n-button size="small" @click="signOut">登出</n-button>
        </n-space>
      </n-layout-header>
      <n-layout-content style="padding: 24px">
        <RouterView />
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>
