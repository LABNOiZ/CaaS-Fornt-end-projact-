import api from './api' 

// 1. ค้นหาลูกค้า (ข้อมูลผลลัพธ์แค่ชื่อเบื้องต้น ไม่ต้องเข้ารหัส)
export const searchCustomer = (payload) => {
  return api.post('/web/call-center/search', payload, { secure: true })
}

// 2. รายละเอียดลูกค้า (ดึงข้อมูลลูกค้าและบัตรแบบถูก Mask ดอกจัน)
export const getCustomerById = (userId) => {
  return api.post('/web/call-center/customer/detail', { userId: userId }, { secure: true })
}

//  [เพิ่มใหม่] 2.1 ขอดูเลขบัตรเต็มๆ 
export const getCardSensitive = (cardId) => {
  return api.post('/web/call-center/customer/card-sensitive', { cardId: cardId }, { secure: true })
}

// 3. อายัดบัตร
export const lockCard = (cardId, reason) => {
  return api.post('/web/call-center/card/lock', { cardId: cardId, reason: reason }, { secure: true })
}

// 4. เช็คสถานะจัดส่ง 
export const getCardTracking = (cardId) => {
    return api.post('/web/call-center/card/tracking', { cardId: cardId }, { secure: true })
}

// 5. ส่งคำร้องขอเปลี่ยนที่อยู่ (มีข้อมูลที่อยู่ลูกค้าใหม่)
export const requestAddressChange = (payload) => {
    return api.post('/web/call-center/card/address-change/request', payload, { secure: true })
}

// 6. ดูประวัติคำร้องขอเปลี่ยนที่อยู่ 
export const getAddressChangeHistory = (userId) => {
    return api.post('/web/call-center/card/address-change/history', { userId: userId }, { secure: true })
}

// 7 ดู Log กิจกรรมลูกค้า
export const getCustomerActivities = (payload) => {
    return api.post('/web/call-center/customer/activities', payload, { secure: true })
}