<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4 text-gray-800">Operational Dashboard</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      
      <div class="bg-cyan-500 rounded-lg p-5 text-white shadow relative overflow-hidden group hover:shadow-md transition">
        <div class="flex justify-between items-start">
            <div>
                <h3 class="font-bold text-lg mb-1">Mobile Users</h3>
                <p class="text-xs opacity-90 mb-3">ลูกค้า Mobile ทั้งหมด</p>
                <div class="text-4xl font-bold">{{ stats.totalMobileUsers }} <span class="text-sm font-normal">บัญชี</span></div>
            </div>
            <div class="bg-white/20 p-3 rounded-full">
                <DevicePhoneMobileIcon class="h-8 w-8 text-white" />
            </div>
        </div>
        <div class="text-[10px] opacity-80 mt-4 border-t border-white/20 pt-2">
            อัปเดตล่าสุด: {{ currentDateTime }}
        </div>
      </div>

      <div class="bg-blue-600 rounded-lg p-5 text-white shadow relative overflow-hidden group hover:shadow-md transition">
        <div class="flex justify-between items-start">
            <div>
                <h3 class="font-bold text-lg mb-1">Web Users</h3>
                <p class="text-xs opacity-90 mb-3">ผู้ใช้งาน Web Portal ทั้งหมด</p>
                <div class="text-4xl font-bold">{{ stats.totalWebUsers }} <span class="text-sm font-normal">บัญชี</span></div>
            </div>
            <div class="bg-white/20 p-3 rounded-full">
                <GlobeAltIcon class="h-8 w-8 text-white" />
            </div>
        </div>
        <div class="text-[10px] opacity-80 mt-4 border-t border-white/20 pt-2">
            อัปเดตล่าสุด: {{ currentDateTime }}
        </div>
      </div>
    </div>

    <h3 class="text-lg font-bold mb-3 text-gray-800">Web User Roles Breakdown</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        <div class="bg-indigo-500 rounded-lg p-4 text-white shadow hover:shadow-md transition relative">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-bold text-sm mb-1">Total Admins</h3>
                    <p class="text-xs opacity-80">ผู้ดูแลระบบ</p>
                    <div class="text-3xl font-bold mt-2">{{ stats.totalAdmins }} <span class="text-sm font-normal">คน</span></div>
                </div>
                <div class="bg-white/20 p-2 rounded-full">
                    <ShieldCheckIcon class="h-6 w-6 text-white" />
                </div>
            </div>
        </div>

        <div class="bg-purple-500 rounded-lg p-4 text-white shadow hover:shadow-md transition relative">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-bold text-sm mb-1">Branch Managers</h3>
                    <p class="text-xs opacity-80">ผู้จัดการสาขา</p>
                    <div class="text-3xl font-bold mt-2">{{ stats.totalBranchManagers }} <span class="text-sm font-normal">คน</span></div>
                </div>
                <div class="bg-white/20 p-2 rounded-full">
                    <BuildingStorefrontIcon class="h-6 w-6 text-white" />
                </div>
            </div>
        </div>

        <div class="bg-pink-500 rounded-lg p-4 text-white shadow hover:shadow-md transition relative">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-bold text-sm mb-1">Call Centers</h3>
                    <p class="text-xs opacity-80">เจ้าหน้าที่ Call Center</p>
                    <div class="text-3xl font-bold mt-2">{{ stats.totalCallCenters }} <span class="text-sm font-normal">คน</span></div>
                </div>
                <div class="bg-white/20 p-2 rounded-full">
                    <PhoneIcon class="h-6 w-6 text-white" />
                </div>
            </div>
        </div>
    </div>

    <h3 class="text-lg font-bold mb-3 text-gray-800">Card Delivery Status</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
       
       <div class="bg-orange-500 rounded-lg p-5 text-white shadow hover:shadow-md transition">
          <h4 class="font-bold text-lg mb-1">ลูกค้าขอ Physical Card (Pending)</h4>
          <p class="text-xs opacity-90 mb-3">รอการจัดส่งบัตร</p>
          <div class="flex items-center justify-between">
             <div class="text-4xl font-bold">{{ stats.cardDeliveryPending }} <span class="text-sm font-normal">รายการ</span></div>
             <div class="bg-white/20 p-2 rounded-full">
                <TruckIcon class="h-6 w-6 text-white" />
             </div>
          </div>
          <div class="text-[10px] opacity-80 mt-4 border-t border-white/20 pt-2">อัปเดตล่าสุด: {{ currentDateTime }}</div>
       </div>

       <div class="bg-green-500 rounded-lg p-5 text-white shadow hover:shadow-md transition">
          <h4 class="font-bold text-lg mb-1">จัดส่งบัตรสำเร็จ (Active)</h4>
          <p class="text-xs opacity-90 mb-3">ลูกค้าได้รับและเปิดใช้งานบัตรแล้ว</p>
          <div class="flex items-center justify-between">
             <div class="text-4xl font-bold">{{ stats.cardDeliverySuccess }} <span class="text-sm font-normal">รายการ</span></div>
             <div class="bg-white/20 p-2 rounded-full">
                <CreditCardIcon class="h-6 w-6 text-white" />
             </div>
          </div>
          <div class="text-[10px] opacity-80 mt-4 border-t border-white/20 pt-2">อัปเดตล่าสุด: {{ currentDateTime }}</div>
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
} from '@heroicons/vue/24/outline'

// จัดการเรื่องวันเวลา (รวมเป็น string เดียวเพื่อความสะดวก)
const currentDateTime = ref('')

// ตัวแปรสำหรับเก็บข้อมูลจริง (ตั้งค่าเริ่มต้นเป็น 0)
const stats = ref({
  totalMobileUsers: 0,
  totalWebUsers: 0,
  totalAdmins: 0,
  totalBranchManagers: 0,
  totalCallCenters: 0,
  cardDeliveryPending: 0,
  cardDeliverySuccess: 0
})

// ดึงข้อมูลจาก API
const fetchDashboardData = async () => {
  try {
    const response = await getAdminDashboardStats()
    const data = response.data
    
    // Map ข้อมูลตาม API Response ใหม่
    stats.value = {
      totalMobileUsers: data.totalMobileUsers || 0,
      totalWebUsers: data.totalWebUsers || 0,
      totalAdmins: data.totalAdmins || 0,
      totalBranchManagers: data.totalBranchManagers || 0,
      totalCallCenters: data.totalCallCenters || 0,
      cardDeliveryPending: data.cardDeliveryPending || 0,  
      cardDeliverySuccess: data.cardDeliverySuccess || 0   
    }

    // อัปเดตเวลาล่าสุดที่ดึงข้อมูล
    const now = new Date()
    currentDateTime.value = now.toLocaleString('th-TH', { 
        day: '2-digit', month: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
    })

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
  }
}

// เรียกใช้เมื่อโหลดหน้าเว็บ
onMounted(() => {
  fetchDashboardData()
})
</script>