import api from './api' 

// Dashboard 
export const getAdminDashboardStats = () => {
  return api.get('/web/dashboard/stats')
}

// ผู้ใช้งานเว็บ
export const getWebUsers = () => {
  return api.get('/web/users')
}

// ค้นหาผู้ใช้
export const searchWebUsers = (query) => {
  return api.post('/web/users/search', {
    queryFullNameTh: query 
  })
}

// แก้ไขข้อมูลผู้ใช้ 
export const updateWebUser = (userid, data) => {
  return api.patch('/web/users/edit', {
    userId: userid,
    ...data
  })
}

// ระงับ ผู้ใช้ 
export const deleteWebUser = (userid) => {
  return api.patch('/web/users/delete', {
    userId: userid
  })
}

// สร้างผู้ใช้ใหม่ 
export const createWebUser = (data) => {
  return api.post('/web/users/add', data)
}

// ดึงข้อมูลโปรไฟล์ผู้ใช้ (ฟังก์ชันนี้สำคัญมากที่ใช้ตอน Login)
export const getUserProfile = () => {
  return api.get('/web/users/profile')
}

// ค้นหา Log ประวัติแอดมิน
export const searchAdminLogs = (searchParams) => {
  return api.post('/web/logs/search', searchParams)
}

export const resetTwoFactor = (targetEmail, password) => {
    return api.post('/web/users/reset-2fa', {
      targetEmail: targetEmail,
      password: password
    })
  }

  // Admin Reset 2FA ให้คนอื่น (ใช้ targetUserId)
export const adminResetTwoFactor = (targetUserId, adminPassword) => {
  return api.post('/web/users/admin-reset-2fa', { 
    targetUserId: targetUserId,  
    password: adminPassword 
  })
}