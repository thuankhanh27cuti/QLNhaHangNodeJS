require('dotenv').config(); // Tải biến môi trường
module.exports = {
    vnp_TmnCode: process.env.VNP_TMNCODE, // Mã định danh merchant kết nối (Terminal Id) 
    vnp_HashSecret: process.env.VNP_HASHSECRET, // Secret key
    vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    vnp_ReturnUrl: 'http://localhost:3000/vn-pay/result-payment',
    vnp_ApiUrl: 'http://sandbox.vnpayment.vn/merchant_webapi/merchant.html',
    apiUrl: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction'
};