package com.farmtech.backend.controller;

import com.farmtech.backend.entity.Farmer;
import com.farmtech.backend.repository.FarmerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private FarmerRepository farmerRepository;

    // ✅ Register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Farmer farmer) {
        if (farmerRepository.findByPhone(farmer.getPhone()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Phone already registered"));
        }
        Farmer savedFarmer = farmerRepository.save(farmer);
        return ResponseEntity.ok(Map.of(
                "message", "Registration successful",
                "farmerId", savedFarmer.getId()
        ));
    }

    // ✅ Login (phone + password)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        String password = request.get("password");

        Optional<Farmer> farmerOpt = farmerRepository.findByPhone(phone);

        if (farmerOpt.isPresent() && farmerOpt.get().getPassword().equals(password)) {
            Farmer farmer = farmerOpt.get();
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "farmerId", farmer.getId(),
                    "name", farmer.getName(),
                    "email", farmer.getEmail(),
                    "phone", farmer.getPhone(),
                    "address", farmer.getAddress()
            ));
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }
}
