import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import AdminLogin from '../views/AdminLogin.vue'
import AdminPanel from '../views/AdminPanel.vue'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/admin/login', component: AdminLogin },
  { path: '/admin/panel', component: AdminPanel }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
