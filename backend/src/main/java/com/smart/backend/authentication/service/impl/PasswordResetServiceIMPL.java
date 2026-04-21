package com.smart.backend.authentication.service.impl;

import com.smart.backend.authentication.repo.UserRepo;
import com.smart.backend.authentication.service.OtpStore;
import com.smart.backend.authentication.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class PasswordResetServiceIMPL implements PasswordResetService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private OtpStore otpStore;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Step 1 — Generate and send OTP
    public void sendOtp(String email) {
        // Check email exists in DB
        userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("EMAIL_NOT_FOUND"));

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Save to store
        otpStore.save(email, otp);

        // Send email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Smart Campus — Password Reset OTP");
        message.setText(
                "Hello,\n\n" +
                        "Your OTP for password reset is: " + otp + "\n\n" +
                        "This code expires in 5 minutes.\n\n" +
                        "If you did not request this, please ignore this email.\n\n" +
                        "Smart Campus Team"
        );
        mailSender.send(message);
    }

    // Step 2 — Verify OTP
    public void verifyOtp(String email, String otp) {
        if (!otpStore.verify(email, otp)) {
            throw new RuntimeException("INVALID_OR_EXPIRED_OTP");
        }
    }

    // Step 3 — Reset Password
    public void resetPassword(String email, String otp, String newPassword) {
        // Verify OTP one more time
        if (!otpStore.verify(email, otp)) {
            throw new RuntimeException("INVALID_OR_EXPIRED_OTP");
        }

        // Update password
        userRepo.findByEmail(email).ifPresent(user -> {
            user.setUserPassword(passwordEncoder.encode(newPassword));
            userRepo.save(user);
        });

        // Remove OTP after successful reset
        otpStore.remove(email);
    }

    public void sendEmailVerificationOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStore.save(email, otp);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Smart Campus — Email Verification");
        message.setText(
                "Hello,\n\n" +
                        "Your email verification code is: " + otp + "\n\n" +
                        "This code expires in 5 minutes.\n\n" +
                        "Smart Campus Team"
        );
        mailSender.send(message);
    }
}
