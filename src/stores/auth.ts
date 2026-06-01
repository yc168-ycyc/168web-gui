import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@supabase/supabase-js'
import { getSupabase } from '@/lib/supabase'

// Roles in ascending access order:
// guest -> pending -> approved -> manager -> super_admin
export type UserRole = 'guest' | 'pending' | 'approved' | 'manager' | 'super_admin'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const role = ref<UserRole>('guest')
  const initialized = ref(false)

  const isLoggedIn = computed(() => user.value !== null)
  const isApproved = computed(() =>
    (['approved', 'manager', 'super_admin'] as UserRole[]).includes(role.value),
  )
  const isAdmin = computed(() =>
    (['manager', 'super_admin'] as UserRole[]).includes(role.value),
  )

  function resolveRole(u: User): UserRole {
    // Role is stored in app_metadata (set server-side via service key)
    return (u.app_metadata?.role as UserRole) ?? 'pending'
  }

  async function init() {
    if (initialized.value) return
    const supabase = getSupabase()
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null
    role.value = user.value ? resolveRole(user.value) : 'guest'
    initialized.value = true

    // Keep store in sync with auth state changes (e.g. token refresh, sign-out)
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
      role.value = user.value ? resolveRole(user.value) : 'guest'
    })
  }

  async function signOut() {
    await getSupabase().auth.signOut()
    user.value = null
    role.value = 'guest'
  }

  return { user, role, isLoggedIn, isApproved, isAdmin, init, signOut }
})
