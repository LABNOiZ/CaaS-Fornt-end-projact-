import api from './api'

// 1. ส่วนของ Dashboard (สถิติสาขา เข้ารหัสไว้ก่อนเพื่อความปลอดภัยของข้อมูลบริษัท)
export const getBranchDashboardStats = () => {
  return api.get('/web/branch-manager/dashboard', { secure: true })
}

// 2. ส่วนของ Approval (ค้นหารายการ) - ข้อมูลทั่วไป ไม่ต้องเข้ารหัส
export const searchApprovals = (payload) => {
  return api.post('/web/branch-manager/approvals/search', payload, { secure: true })
}

// 3. ส่วนของ Approval (กดอนุมัติ/ไม่อนุมัติ)
export const reviewRequest = (requestId, action, reason = "") => {
  return api.post('/web/branch-manager/review', { requestId: requestId, action: action, rejectReason: reason }, { secure: true })
}

// 4. เผื่อใช้ดึงทั้งหมดแบบไม่กรอง
export const getApprovalList = () => {
    return api.get('/web/branch-manager/approve', { secure: true })
}