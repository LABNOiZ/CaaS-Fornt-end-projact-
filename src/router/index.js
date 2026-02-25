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
        
        //  2. เพิ่ม Route สำหรับหน้าลืมรหัสผ่าน
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
    }
  ]
})

//  Router Guard: Logic ที่ครอบคลุม Role 6 และ Reset 2FA
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token')
  const userRoleId = parseInt(sessionStorage.getItem('roleId') || '0') 
  
  //  เช็คว่าเป็น Installer หรือไม่ (ดูทั้ง flag และ roleId เพื่อความชัวร์)
  const isInstaller = sessionStorage.getItem('is_installer') === 'true' || userRoleId === 6

  // Case 1: ไม่ได้ Login แต่จะเข้าหน้า App
  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }

  // Case 2: Login อยู่แล้ว แต่อยากกลับมาหน้า Login (หรือหน้า Forgot Password)
  //  เพิ่ม forgot-password เข้าไปในเงื่อนไข เพื่อไม่ให้คน Login แล้วเข้าไปหน้ากู้รหัส
  if ((to.path === '/login' || to.path === '/forgot-password') && token) {
      if (isInstaller) {
        next('/install/create-admin')
      } 
      else if (userRoleId === 2) next('/admin/dashboard')
      else if (userRoleId === 4) next('/callcenter/search-customer')
      else if (userRoleId === 3) next('/branch/dashboard')
      else next()
      return
  }

  // Case 3: ป้องกัน Installer (Role 6) แอบหนีไปเข้า Dashboard
  if (token && isInstaller && (to.path.startsWith('/admin') || to.path.startsWith('/branch') || to.path.startsWith('/callcenter'))) {
      next('/install/create-admin')
      return
  }

  // Case 4: ป้องกัน User ทั่วไป แอบเข้าหน้า Install (ยกเว้นกรณี Reset 2FA)
  if (token && !isInstaller && to.path.startsWith('/install')) {

      const setupOrigin = sessionStorage.getItem('setupOrigin')
      
      // อนุญาตถ้า setupOrigin เป็น 'install_flow' หรือ 'settings' (จากการกด Reset 2FA)
      if (setupOrigin === 'install_flow' || setupOrigin === 'settings') {
          next()
          return
      }

      // ถ้าไม่มีสิทธิ์ ให้ดีดกลับหน้าหลักของ Role นั้นๆ
      if (userRoleId === 2) next('/admin/dashboard')
      else if (userRoleId === 4) next('/callcenter/search-customer')
      else if (userRoleId === 3) next('/branch/dashboard')
      else next('/login')
      return
  }

  // Case 5: Role Guard (ป้องกันข้าม Role เช่น Branch จะเข้าหน้า Admin)
  if (to.meta.role && to.meta.role !== userRoleId) {
      if (userRoleId === 2) next('/admin/dashboard')
      else if (userRoleId === 4) next('/callcenter/search-customer')
      else if (userRoleId === 3) next('/branch/dashboard')
      else next('/login')
      return
  }

  next()
})

export default router