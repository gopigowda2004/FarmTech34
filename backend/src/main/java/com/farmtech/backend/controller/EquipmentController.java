package com.farmtech.backend.controller;

import com.farmtech.backend.entity.Equipment;
import com.farmtech.backend.entity.Farmer;
import com.farmtech.backend.repository.EquipmentRepository;
import com.farmtech.backend.repository.FarmerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipments")
@CrossOrigin(origins = "http://localhost:3000") // React frontend
public class EquipmentController {

    @Autowired
    private EquipmentRepository equipmentRepo;

    @Autowired
    private FarmerRepository farmerRepo;

    // ✅ Add new equipment (Rent)
    @PostMapping("/add/{farmerId}")
    public Equipment addEquipment(@PathVariable Long farmerId, @RequestBody Equipment eq) {
        Farmer farmer = farmerRepo.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        eq.setOwner(farmer);
        return equipmentRepo.save(eq);
    }

    // ✅ Fetch all other farmers' equipment
    @GetMapping("/others/{farmerId}")
    public List<Equipment> getOtherFarmersEquipments(@PathVariable Long farmerId) {
        return equipmentRepo.findByOwnerIdNot(farmerId);
    }

    // ✅ Fetch logged-in farmer’s own equipment
    @GetMapping("/my/{farmerId}")
    public List<Equipment> getMyEquipments(@PathVariable Long farmerId) {
        return equipmentRepo.findByOwnerId(farmerId);
    }
}
