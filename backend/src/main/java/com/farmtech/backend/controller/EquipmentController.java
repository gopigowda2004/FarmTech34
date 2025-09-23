package com.farmtech.backend.controller;

import com.farmtech.backend.entity.Equipment;
import com.farmtech.backend.entity.Farmer;
import com.farmtech.backend.repository.EquipmentRepository;
import com.farmtech.backend.repository.FarmerRepository;
import com.farmtech.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
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

    @Autowired
    private BookingRepository bookingRepo;

    // ✅ Add new equipment (Rent) - path variable style
    @PostMapping("/add/{farmerId}")
    public Equipment addEquipment(@PathVariable Long farmerId, @RequestBody Equipment eq) {
        Farmer farmer = farmerRepo.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        eq.setOwner(farmer);
        return equipmentRepo.save(eq);
    }

    // ✅ Alternative: Add new equipment with request param to ease frontend integration
    @PostMapping("/add")
    public Equipment addEquipmentWithParam(@RequestParam Long farmerId, @RequestBody Equipment eq) {
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

    // ✅ Fetch equipment by ID (for checkout/details)
    @GetMapping("/{equipmentId}")
    public Equipment getById(@PathVariable Long equipmentId) {
        return equipmentRepo.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
    }

    // ✅ Update equipment (only by owner)
    @PutMapping("/{equipmentId}")
    public Equipment updateEquipment(@PathVariable Long equipmentId,
                                     @RequestParam Long farmerId,
                                     @RequestBody Equipment payload) {
        Equipment existing = equipmentRepo.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
        if (existing.getOwner() == null || !existing.getOwner().getId().equals(farmerId)) {
            throw new RuntimeException("Not authorized to update this equipment");
        }
        // Update allowed fields
        existing.setName(payload.getName());
        existing.setDescription(payload.getDescription());
        existing.setPrice(payload.getPrice());
        existing.setPricePerHour(payload.getPricePerHour());
        existing.setImage(payload.getImage());
        return equipmentRepo.save(existing);
    }

    // ✅ Delete equipment (only by owner) - cascade delete dependent bookings first to avoid FK errors
    @Transactional
    @DeleteMapping("/{equipmentId}")
    public void deleteEquipment(@PathVariable Long equipmentId, @RequestParam Long farmerId) {
        Equipment existing = equipmentRepo.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
        if (existing.getOwner() == null || !existing.getOwner().getId().equals(farmerId)) {
            throw new RuntimeException("Not authorized to delete this equipment");
        }
        // Remove dependent bookings to satisfy foreign key constraints
        bookingRepo.deleteByEquipmentId(equipmentId);
        equipmentRepo.deleteById(equipmentId);
    }
}
