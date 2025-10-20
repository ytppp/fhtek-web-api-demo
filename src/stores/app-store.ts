import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Role, RouterMode, MeshRole } from '@/util/constant'

interface AppState {
  role: Role | null
  mode: RouterMode
  meshRole: MeshRole
  loggedUser: string | null
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    role: null,
    mode: RouterMode.router,
    meshRole: MeshRole.controller,
    loggedUser: null,
  }),
  getters: {
    isSuper: (state) => state.role && state.role === Role.super,
    isAdmin: (state) => state.role && state.role === Role.admin,
  },
  actions: {
    setRole(role: Role) {
      this.role = role
      sessionStorage.setItem('role', role)
    },
    setMode(mode: RouterMode) {
      this.mode = mode
      sessionStorage.setItem('mode', mode)
    },
    setMeshMode(meshRole: MeshRole) {
      this.meshRole = meshRole
      sessionStorage.setItem('meshRole', meshRole)
    },
    setLoggedUser(user: string) {
      this.loggedUser = user
      sessionStorage.setItem('logged_user', user)
    },
    loadFromStorage() {
      const savedRole = sessionStorage.getItem('role') as Role | null
      const savedMode = RouterMode.router // sessionStorage.getItem('mode') as RouterMode | null
      const savedMeshRole = MeshRole.controller // sessionStorage.getItem('meshRole') as MeshRole | null
      const savedLoggedUser = sessionStorage.getItem('logged_user')

      if (savedRole) this.role = savedRole
      if (savedMode) this.mode = savedMode
      if (savedMeshRole) this.meshRole = savedMeshRole
      if (savedLoggedUser) this.loggedUser = savedLoggedUser
    },
  },
})
