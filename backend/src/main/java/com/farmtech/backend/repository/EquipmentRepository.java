package com.farmtech.backend.repository;

import com.farmtech.backend.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    List<Equipment> findByOwnerIdNot(Long ownerId); // Other farmers' equipment
    List<Equipment> findByOwnerId(Long ownerId);    // Farmer’s own equipment
}
