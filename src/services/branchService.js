import api from './api'

// 1. ส่วนของ Dashboard 
export const getBranchDashboardStats = () => {
  return api.get('/web/branch-manager/dashboard', { secure: true })
}

// 2. ส่วนของ Approval (ค้นหารายการ) 
export const searchApprovals = (payload) => {
  return api.post('/web/branch-manager/approvals/search', payload, { secure: true })
}

// 3. ส่วนของ Approval (กดอนุมัติ/ไม่อนุมัติ)
export const reviewRequest = (requestId, action, reason = "") => {
  return api.post('/web/branch-manager/process', { requestId: requestId, action: action, branchReason: reason }, { secure: true }) // อาจจะยังไม่ต้องใส่ secure เพราะข้อมูลที่ส่งไปอาจจะยังไม่ถือเป็นข้อมูลสำคัญจนกว่าจะได้รับการอนุมัติ
}

// 4. เผื่อใช้ดึงทั้งหมดแบบไม่กรอง
export const getApprovalList = () => {
    return api.get('/web/branch-manager/approve', { secure: true })
}

//  5. ดูประวัติที่อยู่ที่ Call Center ขอเปลี่ยน (ที่อยู่ใหม่)
export const getBranchAddressHistory = (userId) => {
    return api.post('/web/branch-manager/address-change/history', { userId: userId }, { secure: true })
}

//  6. ดูข้อมูลที่อยู่เดิมจาก CoreCard (ที่อยู่เก่า)
export const getBranchCardTracking = (cardId) => {
    return api.post('/web/branch-manager/card/tracking', { cardId: cardId }, { secure: true })
}