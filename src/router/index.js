import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import AuthLayout from '@/layouts/AuthLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue' 
import CallCenterLayout from '@/layouts/CallCenterLayout.vue' 
import BranchLayout from '@/layouts/BranchLayout.vue' 

// Auth & Install
import LoginView from '@/views/auth/LoginView.vue'
import LoginTwoFactor from '@/views/auth/LoginTwoFactor.vue' 
import ForgotPassword from '@/views/auth/ForgotPassword.vue' 
import CreateAdmin from '@/views/install/CreateAdmin.vue'
import LoadingStep from '@/views/install/LoadingStep.vue'
import InstallSuccess from '@/views/install/InstallSuccess.vue'
import TwoFactorIntro from '@/views/install/TwoFactorIntro.vue'
import TwoFactorQR from '@/views/install/TwoFactorQR.vue'
import TwoFactorVerify from '@/views/install/TwoFactorVerify.vue'
import TwoFactorComplete from '@/views/install/TwoFactorComplete.vue'

// Admin 
import Dashboard from '@/views/admin/Dashboard.vue'
import WebUsers from '@/views/admin/WebUsers.vue' 
import AdminHistory from '@/views/admin/AdminHistory.vue'
import SettingsProfile from '@/views/admin/settings/SettingsProfile.vue'
import SettingsPassword from '@/views/admin/settings/SettingsPassword.vue'
import SettingsTwoFactor from '@/views/admin/settings/SettingsTwoFactor.vue'

// Call Center
import SearchCustomer from '@/views/callcenter/SearchCustomer.vue'
import CustomerDetail from '@/views/callcenter/CustomerDetail.vue'
import CustomerHistory from '@/views/callcenter/CustomerHistory.vue'
import CallCenterProfile from '@/views/callcenter/settings/SettingsProfile.vue'
import CallCenterPassword from '@/views/callcenter/settings/SettingsPassword.vue'
import CallCenterTwoFactor from '@/views/callcenter/settings/SettingsTwoFactor.vue'

// Branch Manager
import BranchDashboard from '@/views/branch/Dashboard.vue' 
import BranchApproval from '@/views/branch/Approval.vue'
import BranchSettingsProfile from '@/views/branch/settings/SettingsProfile.vue'
import BranchSettingsPassword from '@/views/branch/settings/SettingsPassword.vue'
import BranchSettingsTwoFactor from '@/views/branch/settings/SettingsTwoFactor.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Auth & Installation
    {
      path: '/',
      component: AuthLayout,
      children: [
        { path: '', redirect: '/login' }, 
        { path: 'login', name: 'Login', component: LoginView },
        { path: 'login-2fa', name: 'LoginTwoFactor', component: LoginTwoFactor }, 
        { path: 'forgot-password', name: 'ForgotPassword', component: ForgotPassword },

        { path: 'install/create-admin', name: 'CreateAdmin', component: CreateAdmin },
        { path: 'install/loading', name: 'LoadingStep', component: LoadingStep },
        { path: 'install/success', name: 'InstallSuccess', component: InstallSuccess },
        { path: 'install/two-factor-intro', name: 'TwoFactorIntro', component: TwoFactorIntro },
        { path: 'install/two-factor-qr', name: 'TwoFactorQR', component: TwoFactorQR },
        { path: 'install/two-factor-verify', name: 'TwoFactorVerify', component: TwoFactorVerify },
        { path: 'install/two-factor-complete', name: 'TwoFactorComplete', component: TwoFactorComplete },
      ]
    },
 
    // ADMIN ROUTES
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, role: 2 }, 
      children: [
        { path: 'dashboard', name: 'AdminDashboard', component: Dashboard },
        { path: 'web-users', name: 'WebUsers', component: WebUsers },
        { path: 'admin-history', name: 'AdminHistory', component: AdminHistory },
        { path: 'settings/profile', name: 'SettingsProfile', component: SettingsProfile },
        { path: 'settings/password', name: 'SettingsPassword', component: SettingsPassword },
        { path: 'settings/2fa', name: 'SettingsTwoFactor', component: SettingsTwoFactor },
      ]
    },

    // CALL CENTER ROUTES
    {
      path: '/callcenter', 
      component: CallCenterLayout,
      meta: { requiresAuth: true, role: 4 }, 
      redirect: '/callcenter/search-customer', 
      children: [
          { path: 'search-customer', name: 'CallCenterSearch', component: SearchCustomer},
          { path: 'customer/:id', name: 'CustomerDetail', component: CustomerDetail },   
          { path: 'customer-history', name: 'CustomerHistory', component: CustomerHistory},
          
          { path: 'settings/profile', name: 'CallCenterProfile', component: CallCenterProfile },
          { path: 'settings/password', name: 'CallCenterPassword', component: CallCenterPassword },
          { path: 'settings/2fa', name: 'CallCenter2FA', component: CallCenterTwoFactor },
      ]
    },

    // BRANCH MANAGER ROUTES 
    {
      path: '/branch',
      component: BranchLayout, 
      meta: { requiresAuth: true, role: 3 }, 
      redirect: '/branch/dashboard',
      children: [
        { path: 'dashboard', name: 'BranchDashboard', component: BranchDashboard },
        { path: 'approval', name: 'BranchApproval', component: BranchApproval},
        { path: 'settings', redirect: '/branch/settings/profile' },

        { path: 'settings/profile', name: 'BranchProfile', component: BranchSettingsProfile },
        { path: 'settings/password', name: 'BranchPassword', component: BranchSettingsPassword },
        { path: 'settings/2fa', name: 'Branch2FA', component: BranchSettingsTwoFactor }, 
      ]
    },

    // 404 Catch-All Route: ดักจับ URL มั่วๆ แล้วส่งกลับหน้า Login 
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login'
    }
  ]
})

// Router Guard: Logic ที่ครอบคลุม Role 6 และสถาปัตยกรรม BFF
router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem('is_logged_in') === 'true'
  const userRoleId = parseInt(sessionStorage.getItem('roleId') || '0') 
  
  const isInstaller = sessionStorage.getItem('is_installer') === 'true' || userRoleId === 6

  //  Helper ฟังก์ชัน: เตะผู้ใช้กลับไปหน้าหลักตาม Role ของตัวเอง
  const redirectToHome = () => {
      if (userRoleId === 2) return '/admin/dashboard'
      if (userRoleId === 4) return '/callcenter/search-customer'
      if (userRoleId === 3) return '/branch/dashboard'
      return '/login'
  }

  // Case 1: ไม่ได้ Login แต่จะเข้าหน้า App (ที่ต้องการสิทธิ์)
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  // Case 2: Login อยู่แล้ว แต่อยากกลับมาหน้า Login หรือ Forgot Password
  if ((to.path === '/login' || to.path === '/forgot-password') && isAuthenticated) {
      if (isInstaller) {
        return next('/install/create-admin')
      } 
      return next(redirectToHome())
  }

  // Case 3: ป้องกัน Installer แอบหนีไปเข้า Dashboard ทั่วไป
  if (isAuthenticated && isInstaller && (to.path.startsWith('/admin') || to.path.startsWith('/branch') || to.path.startsWith('/callcenter'))) {
      return next('/install/create-admin')
  }

  // Case 4: ป้องกัน User ทั่วไป แอบเข้าหน้า Install
  if (isAuthenticated && !isInstaller && to.path.startsWith('/install')) {
      const setupOrigin = sessionStorage.getItem('setupOrigin')
      
      // อนุญาตถ้า setupOrigin เป็น 'install_flow' หรือ 'settings'
      if (setupOrigin === 'install_flow' || setupOrigin === 'settings') {
          return next()
      }

      // ถ้าไม่มีสิทธิ์ ให้ดีดกลับหน้าหลัก
      return next(redirectToHome())
  }

  //  Case 5: Role Guard ป้องกันข้ามโซนเด็ดขาด (Ironclad Security) 
  // ดักจับจาก URL Path โดยตรง 
  if (isAuthenticated && !isInstaller) {
      if (to.path.startsWith('/admin') && userRoleId !== 2) {
          return next(redirectToHome()) // ถ้าเข้า /admin แต่ไม่ใช่ Role 2 เตะกลับทันที
      }
      if (to.path.startsWith('/branch') && userRoleId !== 3) {
          return next(redirectToHome()) // ถ้าเข้า /branch แต่ไม่ใช่ Role 3 เตะกลับทันที
      }
      if (to.path.startsWith('/callcenter') && userRoleId !== 4) {
          return next(redirectToHome()) // ถ้าเข้า /callcenter แต่ไม่ใช่ Role 4 เตะกลับทันที
      }
  }
  
  next()
})

export default router