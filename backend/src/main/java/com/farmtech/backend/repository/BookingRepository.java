package com.farmtech.backend.repository;

import com.farmtech.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByRenterId(Long renterId); // Bookings made by a renter (buyer view)
    List<Booking> findByOwnerId(Long ownerId);   // Bookings received for an owner's equipment (owner view)

    // Clean up all bookings referencing an equipment (to avoid FK constraint on delete)
    void deleteByEquipmentId(Long equipmentId);
}