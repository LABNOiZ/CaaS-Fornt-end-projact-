import api from './api' 

// 1. ค้นหาลูกค้า (post)
export const searchCustomer = (payload) => {
  // payload ที่รับมาจะเป็น { queryCitizenId: "...", queryFullNameTh: "..." }
  return api.post('/web/call-center/search', payload)
}

// 2. รายละเอียดลูกค้า (post)
export const getCustomerById = (userId) => {
  return api.post('/web/call-center/customer/detail', {
    userId: userId  
  })
}

// 3. อายัดบัตร (POST)
export const lockCard = (cardId, reason) => {
  return api.post('/web/call-center/card/lock', {
    cardId: cardId, 
    reason: reason  
  })
}

// 4. เช็คสถานะจัดส่ง (POST) - สำหรับบัตร Active
export const getCardTracking = (cardId) => {
    return api.post('/web/call-center/card/tracking', {
        cardId: cardId
    })
}

// 5. ส่งคำร้องขอเปลี่ยนที่อยู่ (POST)
export const requestAddressChange = (payload) => {
    // payload ต้องประกอบด้วย: userId, cardId, address, subdistrict, district, province, zipcode
    return api.post('/web/call-center/card/address-change/request', payload)
}

// 6. ดูประวัติคำร้องขอเปลี่ยนที่อยู่ (POST) - เพื่อเช็คว่ามี Pending หรือไม่
export const getAddressChangeHistory = (userId) => {
    return api.post('/web/call-center/card/address-change/history', {
        userId: userId
    })
}

// 7 ดู Log กิจกรรมลูกค้า (POST)
export const getCustomerActivities = (payload) => {
    // payload: { fullNameTh, startDate, endDate, startTime, endTime }
    return api.post('/web/call-center/customer/activities', payload)
}