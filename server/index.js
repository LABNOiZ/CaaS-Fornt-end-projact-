require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const { generateKeyPair, exportJWK, compactDecrypt, importSPKI, CompactEncrypt } = require('jose');

const app = express();
const PORT = process.env.PORT || 3000;
const TARGET_URL = process.env.TARGET_URL;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true 
}));

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:3000; img-src 'self' data:;"
    );
    next();
});

//  ให้รับ req และ res เข้ามาด้วย เพื่อส่งต่อ Cookie ทะลุหากัน
async function callSecureBackend(req, res, method, path, data) {
    try {
        const { publicKey, privateKey } = await generateKeyPair('RSA-OAEP-256', { extractable: true });
        const publicJwk = await exportJWK(publicKey);

        const headers = {
            'Content-Type': 'application/json',
            'X-Client-Public-Key': JSON.stringify(publicJwk)
        };

        // ขาไป: ถ้า Vue ส่ง Cookie อะไรมา (เช่น WEB_ACCESS_TOKEN) ให้ส่งทะลุไปหาแนทเลย
        if (req.headers.cookie) {
            headers['Cookie'] = req.headers.cookie;
            console.log(` ส่ง Cookie ทะลุไปหาแนท...`);
        }

        let payload = data;
        
        // ห่อ JWE เฉพาะ Method ที่ไม่ใช่ GET และมีข้อมูลใน Body
        if (method !== 'GET' && data && Object.keys(data).length > 0) {
            const cleanKeyStr = process.env.BACKEND_PUBLIC_KEY
                .replace(/^"|"$/g, '').replace(/^'|'$/g, '').replace(/\\n/g, '\n').trim();
            const backendPubKey = await importSPKI(cleanKeyStr, 'RSA-OAEP-256');
            const encodedData = new TextEncoder().encode(JSON.stringify(data));

            const jweString = await new CompactEncrypt(encodedData)
                .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
                .encrypt(backendPubKey);

            payload = { payload: jweString };
            console.log(` ข้อมูลที่ถูกห่อเป็น JWE ก่อนส่งไปหาแนท:`, payload);
        } else {
            // ถ้าเป็น GET หรือไม่มี Body ให้ Log แบบสวยๆ แทน
            console.log(` HTTP Method: ${method} (ผ่านฉลุย ใช้ Cookie ยืนยันตัวตน)`);
        }

        const response = await axios({
            method: method,
            url: `${TARGET_URL}${path}`,
            data: payload,
            headers: headers
        });

        // ขากลับ: ถ้าแนทสั่ง Set-Cookie มา (เช่นตอน Verify 2FA สำเร็จ) ให้ส่งทะลุกลับไปหา Browser
        if (response.headers['set-cookie']) {
            res.setHeader('Set-Cookie', response.headers['set-cookie']);
            console.log(" ได้รับ WEB_ACCESS_TOKEN จากแนท ส่งลง Browser เรียบร้อย!");
        }

        if (response.data && typeof response.data === 'string') {
            const { plaintext } = await compactDecrypt(response.data, privateKey);
            const jsonString = new TextDecoder().decode(plaintext);
            return JSON.parse(jsonString);
        }

        return response.data;
    } catch (error) {
        console.error(` Backend Error (${method} ${path}):`, error.response?.data || error.message);
        throw error;
    }
}

// 1.1 Route ล็อกอิน (Step 1)
app.post('/api/v1/web/auth/login', async (req, res) => {
    console.log("-----------------------------------------");
    console.log(" Request Login เข้ามา...");
    try {
        const backendData = await callSecureBackend(req, res, 'POST', '/api/v1/web/auth/login', req.body);
        res.json(backendData); 
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Login Failed at BFF' });
    }
});

// 1.2 Route ยืนยัน 2FA (Step 2)
app.post('/api/v1/web/auth/verify-2fa', async (req, res) => {
    console.log("-----------------------------------------");
    console.log(" มีการส่งเลข 2FA มายืนยันที่ BFF...");
    try {
        const backendData = await callSecureBackend(req, res, 'POST', '/api/v1/web/auth/verify-2fa', req.body);
        res.json(backendData);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: '2FA Verification Failed' });
    }
}); //  ปิดปีกกาของ Route นี้ให้ถูกต้องตรงนี้!

// 1.3 Route ล็อกเอาต์ (Logout)
app.post('/api/v1/web/auth/logout', async (req, res) => {
    console.log("-----------------------------------------");
    console.log(" Request Logout เข้ามาที่ BFF...");
    try {
        // ยิงไปบอกแนท (Backend) ว่าขอล็อกเอาต์
        await callSecureBackend(req, res, 'POST', '/api/v1/web/auth/logout', {});

        // สั่ง Browser ล้างคุกกี้ที่ BFF เคยสร้างไว้ (ถ้ามี)
        res.clearCookie('auth_token', { path: '/' });
        
        // สั่งล้างคุกกี้ที่แนทส่งมาด้วยการ "หมดอายุทันที"
        res.cookie('WEB_ACCESS_TOKEN', '', { maxAge: 0, path: '/' });
        res.cookie('WEB_REFRESH_TOKEN', '', { maxAge: 0, path: '/' });

        console.log(" ล้างคุกกี้เรียบร้อย! ส่งผลสำเร็จกลับไปที่ Vue");
        res.json({ status: "SUCCESS", message: "Logged out successfully" });
    } catch (error) {
        console.error(" Logout Error:", error.response?.data || error.message);
        res.clearCookie('auth_token', { path: '/' });
        res.status(200).json({ status: "FORCE_LOGOUT", message: "Logout with some backend errors" });
    }
});

// 2. Wildcard Route สำหรับ API อื่นๆ
app.all(/^\/api\/v1\/.*/, async (req, res) => {
    try {
        const path = req.originalUrl;
        console.log(` Proxying ${req.method}: ${path}`);
        
        const backendData = await callSecureBackend(req, res, req.method, path, req.body);
        res.json(backendData);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'BFF Proxy Error' });
    }
});

app.listen(PORT, () => {
    console.log(` BFF Server Manager รันพร้อมแล้วที่ http://localhost:${PORT}`);
});