import api from './api' 

// Dashboard (ตัวเลขสถิติสำคัญ ควรเข้ารหัสตอนส่งกลับ)
export const getAdminDashboardStats = () => {
  return api.get('/web/dashboard/stats', { secure: true })
}

// ผู้ใช้งานเว็บ
export const getWebUsers = () => {
  return api.get('/web/users', { secure: true })
}

// ค้นหาผู้ใช้
export const searchWebUsers = (query) => {
  return api.post('/web/users/search', { queryFullNameTh: query }, { secure: true })
}

// แก้ไขข้อมูลผู้ใช้ (อาจมีข้อมูลสำคัญ)
export const updateWebUser = (userid, data) => {
  return api.patch('/web/users/edit', { userId: userid, ...data }, { secure: true })
}

// ระงับผู้ใช้ (มีการส่ง Password ต้องเข้ารหัส!)
export const deleteWebUser = (userId, password) => {
  return api.patch('/web/users/delete', { userId: userId, password: password }, { secure: true })
}

// สร้างผู้ใช้ใหม่ (มีรหัสผ่านและข้อมูลส่วนตัว)
export const createWebUser = (data) => {
  return api.post('/web/users/add', data, { secure: true })
}

// ค้นหา Log ประวัติแอดมิน
export const searchAdminLogs = (searchParams) => {
  return api.post('/web/logs/search', searchParams, { secure: true })
}

// Reset 2FA โดยใช้อีเมล (มีการส่ง Password ต้องเข้ารหัส!)
export const resetTwoFactor = (targetEmail, password) => {
  return api.post('/web/users/reset-2fa', { targetEmail: targetEmail, password: password }, { secure: true })
}

// Admin Reset 2FA ให้คนอื่น (มีการส่ง Password ต้องเข้ารหัส!)
export const adminResetTwoFactor = (targetUserId, adminPassword) => {
  return api.post('/web/users/admin-reset-2fa', { targetUserId: targetUserId, password: adminPassword }, { secure: true })
}