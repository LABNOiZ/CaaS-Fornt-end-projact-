<template>
  <div class="p-6 max-w-[1600px] mx-auto">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Operational Dashboard</h2>
        <p class="text-xs text-gray-500 mt-1">ภาพรวมข้อมูลผู้ใช้งานและการจัดส่งบัตร</p>
      </div>
      <div class="text-right">
         <span class="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            Last updated: {{ currentDateTime }}
         </span>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-5">
      
      <div class="col-span-12 md:col-span-6 relative group">
        <div class="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between overflow-hidden">
          <div class="absolute -right-6 -top-6 bg-white/10 w-32 h-32 rounded-full blur-2xl"></div>
          <div class="flex justify-between items-start z-10">
            <div>
              <div class="flex items-center gap-2 mb-2">
                 <div class="p-2 bg-white/20 rounded-lg">
                    <DevicePhoneMobileIcon class="h-6 w-6 text-white" />
                 </div>
                 <h3 class="font-semibold text-lg">Mobile Users</h3>
              </div>
              <p class="text-sm opacity-90">บัญชีลูกค้า Mobile ทั้งหมด</p>
            </div>
            <div class="text-5xl font-bold tracking-tighter">
              {{ formatNumber(stats.totalMobileUsers) }}
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-white/20 flex justify-between items-center text-xs opacity-80">
             <span>Active Accounts</span>
             <span class="bg-white/20 px-2 py-0.5 rounded text-[10px]">Live Data</span>
          </div>
        </div>
      </div>

      <div class="col-span-12 md:col-span-6 relative group">
        <div class="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between overflow-hidden">
          <div class="absolute -right-6 -top-6 bg-white/10 w-32 h-32 rounded-full blur-2xl"></div>
          <div class="flex justify-between items-start z-10">
            <div>
              <div class="flex items-center gap-2 mb-2">
                 <div class="p-2 bg-white/20 rounded-lg">
                    <GlobeAltIcon class="h-6 w-6 text-white" />
                 </div>
                 <h3 class="font-semibold text-lg">Web Users</h3>
              </div>
              <p class="text-sm opacity-90">บัญชี Web Portal ทั้งหมด</p>
            </div>
            <div class="text-5xl font-bold tracking-tighter">
               {{ formatNumber(stats.totalWebUsers) }}
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-white/20 flex justify-between items-center text-xs opacity-80">
             <span>Portal Access</span>
             <span class="bg-white/20 px-2 py-0.5 rounded text-[10px]">Live Data</span>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-8">
         <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">User Roles Breakdown</h3>
         <div class="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            
            <div class="bg-white border border-indigo-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
               <div class="absolute right-0 top-0 w-16 h-16 bg-indigo-50 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
               <div class="relative z-10">
                  <div class="flex items-center justify-between mb-3">
                     <div class="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                        <ShieldCheckIcon class="h-6 w-6" />
                     </div>
                  </div>
                  <div class="text-3xl font-bold text-gray-800">{{ formatNumber(stats.totalAdmins) }}</div>
                  <div class="text-sm font-medium text-gray-500 mt-1">Total Admins</div>
                  <p class="text-xs text-gray-400">ผู้ดูแลระบบ</p>
               </div>
            </div>

            <div class="bg-white border border-purple-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
               <div class="absolute right-0 top-0 w-16 h-16 bg-purple-50 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
               <div class="relative z-10">
                  <div class="flex items-center justify-between mb-3">
                     <div class="bg-purple-100 p-2 rounded-lg text-purple-600">
                        <BuildingStorefrontIcon class="h-6 w-6" />
                     </div>
                  </div>
                  <div class="text-3xl font-bold text-gray-800">{{ formatNumber(stats.totalBranchManagers) }}</div>
                  <div class="text-sm font-medium text-gray-500 mt-1">Branch Managers</div>
                  <p class="text-xs text-gray-400">ผู้จัดการสาขา</p>
               </div>
            </div>

            <div class="bg-white border border-pink-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
               <div class="absolute right-0 top-0 w-16 h-16 bg-pink-50 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
               <div class="relative z-10">
                  <div class="flex items-center justify-between mb-3">
                     <div class="bg-pink-100 p-2 rounded-lg text-pink-600">
                        <PhoneIcon class="h-6 w-6" />
                     </div>
                  </div>
                  <div class="text-3xl font-bold text-gray-800">{{ formatNumber(stats.totalCallCenters) }}</div>
                  <div class="text-sm font-medium text-gray-500 mt-1">Call Centers</div>
                  <p class="text-xs text-gray-400">เจ้าหน้าที่บริการ</p>
               </div>
            </div>

         </div>
      </div>

      <div class="col-span-12 lg:col-span-4 flex flex-col h-full">
         <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Card Delivery</h3>
         <div class="flex flex-col gap-4 flex-1">
            
            <div class="bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl p-4 text-white shadow hover:shadow-lg transition flex items-center justify-between flex-1">
               <div>
                  <p class="text-xs font-medium opacity-90 mb-1">ลูกค้าขอ Physical Card (Pending)</p>
                  <div class="text-2xl font-bold">{{ formatNumber(stats.cardDeliveryPending) }} <span class="text-xs font-normal">รายการ</span></div>
               </div>
               <div class="bg-white/20 p-2 rounded-full">
                  <TruckIcon class="h-6 w-6" />
               </div>
            </div>

            <div class="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-4 text-white shadow hover:shadow-lg transition flex items-center justify-between flex-1">
               <div>
                  <p class="text-xs font-medium opacity-90 mb-1">จัดส่งสำเร็จ ลูกค้าเปิดใช้งานแล้วบัตรแล้ว</p>
                  <div class="text-2xl font-bold">{{ formatNumber(stats.cardDeliverySuccess) }} <span class="text-xs font-normal">รายการ</span></div>
               </div>
               <div class="bg-white/20 p-2 rounded-full">
                  <CreditCardIcon class="h-6 w-6" />
               </div>
            </div>

         </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAdminDashboardStats } from '@/services/adminService'

import { 
  DevicePhoneMobileIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon, 
  BuildingStorefrontIcon, 
  PhoneIcon,
  TruckIcon,
  CreditCardIcon
} from '@heroicons/vue/24/solid' // *แนะนำให้ใช้ Solid หรือ Outline ก็ได้ครับ

const currentDateTime = ref('')

const stats = ref({
  totalMobileUsers: 0,
  totalWebUsers: 0,
  totalAdmins: 0,
  totalBranchManagers: 0,
  totalCallCenters: 0,
  cardDeliveryPending: 0,
  cardDeliverySuccess: 0
})

// ฟังก์ชันจัดรูปแบบตัวเลข (ใส่ลูกน้ำ)
const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const fetchDashboardData = async () => {
  try {
    const response = await getAdminDashboardStats()
    const data = response.data
    
    stats.value = {
      totalMobileUsers: data.totalMobileUsers || 0,
      totalWebUsers: data.totalWebUsers || 0,
      totalAdmins: data.totalAdmins || 0,
      totalBranchManagers: data.totalBranchManagers || 0,
      totalCallCenters: data.totalCallCenters || 0,
      cardDeliveryPending: data.cardDeliveryPending || 0,  
      cardDeliverySuccess: data.cardDeliverySuccess || 0   
    }

    const now = new Date()
    currentDateTime.value = now.toLocaleString('th-TH', { 
        day: '2-digit', month: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
    })

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    // Optional: ใส่ค่า Mock เพื่อดูความสวยงามตอน Dev
    // stats.value = { totalMobileUsers: 12500, totalWebUsers: 340, totalAdmins: 5, totalBranchManagers: 12, totalCallCenters: 45, cardDeliveryPending: 120, cardDeliverySuccess: 5600 }
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

