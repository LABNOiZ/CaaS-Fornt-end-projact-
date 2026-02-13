import api from './api'

//  1. ส่วนของ Dashboard (จำเป็นต้องมี เพื่อไม่ให้หน้า Dashboard จอขาว)
export const getBranchDashboardStats = () => {
  return api.get('/web/branch-manager/dashboard')
}

//  2. ส่วนของ Approval (ค้นหารายการ)
export const searchApprovals = (payload) => {
  // payload: { fullNameTh, startDate, endDate, startTime, endTime }
  return api.post('/web/branch-manager/approvals/search', payload)
}

//  3. ส่วนของ Approval (กดอนุมัติ/ไม่อนุมัติ)
export const reviewRequest = (requestId, action, reason = "") => {
  return api.post('/web/branch-manager/review', {
    requestId: requestId,
    action: action,
    rejectReason: reason
  })
}

//  4. (Optional) เผื่อใช้ดึงทั้งหมดแบบไม่กรอง
export const getApprovalList = () => {
    return api.get('/web/branch-manager/approve')
}