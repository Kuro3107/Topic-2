package com.example.SWP_Project_BackEnd.Controller;

import com.example.SWP_Project_BackEnd.Service.BookingService;
import com.example.SWP_Project_BackEnd.Service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/vnpay")
@CrossOrigin(origins = "http://localhost:5173")
public class VNPayController {

    private final String tmnCode = "FCQGXYEF";
    private final String secretKey = "5DHWJUAO6ELG2KFHDGET7OCSEK9NF33R";
    private final String vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private final String returnUrl = "http://localhost:8080/api/vnpay/return";

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private BookingService bookingService;

    // Your purchase method here
    @PostMapping("/purchase")
    public ResponseEntity<Map<String, String>> purchase(
            @RequestParam String orderId,
            @RequestParam double amount) throws Exception {

        String redirectUrl = paymentService.generatePaymentUrl(orderId, amount);

        Map<String, String> response = new HashMap<>();
        response.put("redirectUrl", redirectUrl);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/return")
    public ModelAndView returnPayment(@RequestParam Map<String, String> allParams) throws Exception {
        System.out.println("Return payment called with params: " + allParams);

        String orderId = allParams.get("vnp_TxnRef");
        String paymentStatus = allParams.get("vnp_TransactionStatus");
        String responseCode = allParams.get("vnp_ResponseCode");
        String redirectUrl = "http://localhost:5173/profile";

        if ("00".equals(paymentStatus)) {
            // Thanh toán thành công
            System.out.println("Payment successful, updating booking status...");
            bookingService.updateStatus(Integer.valueOf(orderId), "Purchased");
            // Điều hướng về /profile mà không có query parameters
            redirectUrl += "?message=success";
        } else if ("01".equals(responseCode) || "00".equals(paymentStatus)) {
            // Giao dịch đã tồn tại, cho phép thanh toán lại
            System.out.println("Transaction already exists or has been processed. Allowing user to retry.");
            redirectUrl += "?message=retry";
        } else {
            // Thanh toán không thành công
            System.out.println("Payment verification failed or status not successful");
            redirectUrl += "?message=failure";
        }
        return new ModelAndView("redirect:" + redirectUrl);
    }


}
