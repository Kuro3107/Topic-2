package com.example.SWP_Project_BackEnd.Service;

import org.apache.commons.codec.binary.Hex;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final String tmnCode = "FCQGXYEF";
    private final String secretKey = "5DHWJUAO6ELG2KFHDGET7OCSEK9NF33R";
    private final String vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private final String returnUrl = "http://localhost:8080/api/vnpay/return";

    public String generatePaymentUrl(String orderId, double amount) throws Exception {
        int amountInVND = (int) (amount * 100); // Convert to VND units (x100 if amount is in VND)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        LocalDateTime createdDate = LocalDateTime.now();
        String formattedDateTime = createdDate.format(formatter);

        // Prepare parameters for the URL and hash
        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Version", "2.0.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", tmnCode);
        params.put("vnp_Amount", String.valueOf(amountInVND));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", orderId);
        params.put("vnp_OrderInfo", "Thanh toán đơn hàng: " + orderId);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", returnUrl);
        params.put("vnp_CreateDate", formattedDateTime);
        params.put("vnp_IpAddr", "192.168.101.19");

        // Xây dựng dữ liệu chữ ký
        StringBuilder signDataBuilder = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            signDataBuilder.append(entry.getKey());
            signDataBuilder.append("=");
            signDataBuilder.append(entry.getValue());
            signDataBuilder.append("&");
        }
        signDataBuilder.deleteCharAt(signDataBuilder.length() - 1); //remove last "&"
        String signData = signDataBuilder.toString();

        // Tính toán chữ ký HMAC
        String signed = generateHMAC(secretKey, signData);
        params.put("vnp_SecureHash", signed);

        // Xây dựng URL thanh toán
        StringBuilder urlBuilder = new StringBuilder(vnpUrl);
        urlBuilder.append("?");
        for (Map.Entry<String, String> entry : params.entrySet()) {
            urlBuilder.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8.toString()));
            urlBuilder.append("=");
            urlBuilder.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString()));
            urlBuilder.append("&");
        }
        urlBuilder.deleteCharAt(urlBuilder.length() - 1); // Remove last "&
        return urlBuilder.toString();
    }


    public String generateHMAC(String secretKey, String data) throws Exception {
        Mac hmacSha512 = Mac.getInstance("HmacSHA512");
        SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmacSha512.init(keySpec);
        byte[] hmacBytes = hmacSha512.doFinal(data.getBytes(StandardCharsets.UTF_8));

        StringBuilder result = new StringBuilder();
        for (byte b : hmacBytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }

    public boolean verifyVnpayResponse(Map<String, String> params, String secureHash) throws Exception {
        // Tạo chuỗi ký từ các tham số và loại bỏ "vnp_SecureHash"
        String hashData = params.entrySet().stream()
                .filter(entry -> !entry.getKey().equals("vnp_SecureHash") && !entry.getKey().equals("vnp_SecureHashType"))
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining("&"));

        // Tính toán chữ ký dựa trên dữ liệu đã tạo
        String calculatedHash = generateHMAC(secretKey, hashData);

        // In log để so sánh trực tiếp
        System.out.println("Hash data for verification: " + hashData);
        System.out.println("Calculated secure hash: " + calculatedHash);
        System.out.println("Received secure hash: " + secureHash);

        // So sánh chữ ký đã tính với chữ ký nhận được từ VNPay
        return calculatedHash.equalsIgnoreCase(secureHash);
    }


}
