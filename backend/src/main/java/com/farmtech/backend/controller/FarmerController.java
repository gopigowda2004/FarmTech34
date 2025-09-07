package com.farmtech.backend.controller;

import com.farmtech.backend.entity.Farmer;
import com.farmtech.backend.repository.FarmerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/farmers")
@CrossOrigin(origins = "http://localhost:3000") // React frontend
public class FarmerController {

    @Autowired
    private FarmerRepository farmerRepository;

    // ✅ Get farmer profile by ID
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id) {
        Optional<Farmer> farmer = farmerRepository.findById(id);
        if (farmer.isPresent()) {
            return ResponseEntity.ok(farmer.get());
        }
        return ResponseEntity.status(404).body("Farmer not found");
    }
}
