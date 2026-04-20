package com.smart.backend.authentication.controller;

import com.smart.backend.authentication.dto.ResetPasswordRequest;
import com.smart.backend.authentication.dto.SendOtpRequest;
import com.smart.backend.authentication.dto.VerifyOtpRequest;
import com.smart.backend.authentication.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/password")
@CrossOrigin
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody SendOtpRequest request) {
        try {
            passwordResetService.sendOtp(request.getEmail());
            return ResponseEntity.ok("{\"message\": \"OTP sent to your email\"}");
        } catch (RuntimeException e) {
            if (e.getMessage().equals("EMAIL_NOT_FOUND")) {
                return ResponseEntity.status(404)
                        .body("{\"error\": \"No account found with this email\"}");
            }
            return ResponseEntity.status(500)
                    .body("{\"error\": \"Failed to send OTP. Try again.\"}");
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        try {
            passwordResetService.verifyOtp(request.getEmail(), request.getOtp());
            return ResponseEntity.ok("{\"message\": \"OTP verified successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400)
                    .body("{\"error\": \"Invalid or expired OTP\"}");
        }
    }

    // Step 3 — Reset Password
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            passwordResetService.resetPassword(
                    request.getEmail(),
                    request.getOtp(),
                    request.getNewPassword()
            );
            return ResponseEntity.ok("{\"message\": \"Password reset successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400)
                    .body("{\"error\": \"Invalid or expired OTP\"}");
        }
    }
}
