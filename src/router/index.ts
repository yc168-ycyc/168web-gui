import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Public ────────────────────────────────────────────────
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },

    // ── Member (login required) ───────────────────────────────
    {
      path: '/member',
      name: 'member',
      component: () => import('@/views/MemberView.vue'),
      meta: { requiresAuth: true },
    },

    // ── Approved member only ──────────────────────────────────
    {
      path: '/list',
      name: 'list',
      component: () => import('@/views/ListView.vue'),
      meta: { requiresAuth: true, requiresApproved: true },
    },
    {
      path: '/list/:id',
      name: 'detail',
      component: () => import('@/views/DetailView.vue'),
      meta: { requiresAuth: true, requiresApproved: true },
    },

    // ── Admin only ────────────────────────────────────────────
    {
      path: '/admin',
      redirect: '/admin/assets',
    },
    {
      path: '/admin/assets',
      name: 'admin-assets',
      component: () => import('@/views/admin/AssetsView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/roles',
      name: 'admin-roles',
      component: () => import('@/views/admin/RolesView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/logs',
      name: 'admin-logs',
      component: () => import('@/views/admin/LogsView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },

    // ── Fallback ──────────────────────────────────────────────
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
})

// Set to true to bypass all role/auth guards during development
const BYPASS_AUTH = import.meta.env.DEV

router.beforeEach(async (to) => {
  if (BYPASS_AUTH) return

  const auth = useAuthStore()
  await auth.init()

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return auth.isLoggedIn ? { name: 'member' } : { name: 'login' }
  }
  if (to.meta.requiresApproved && !auth.isApproved) {
    return auth.isLoggedIn ? { name: 'member' } : { name: 'login' }
  }
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login' }
  }
})

export default router
