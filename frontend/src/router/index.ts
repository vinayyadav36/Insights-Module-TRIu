import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Dashboard from '../pages/Dashboard.vue';
import Editor from '../pages/Editor.vue';
import Preview from '../pages/Preview.vue';
import LoginCallback from '../pages/auth/LoginCallback.vue';
import PublicProfile from '../pages/PublicProfile.vue';
import SuperAdminDashboard from '../pages/admin/SuperAdminDashboard.vue';
import Insights from '../pages/Insights.vue';
import { useAuthStore } from '../stores/authStore';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/auth/callback', component: LoginCallback },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/editor/:id?', component: Editor, meta: { requiresAuth: true } },
  { path: '/p/:slug', component: Preview },
  { path: '/u/:id', component: PublicProfile },
  { path: '/admin', component: SuperAdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/insights', component: Insights }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
