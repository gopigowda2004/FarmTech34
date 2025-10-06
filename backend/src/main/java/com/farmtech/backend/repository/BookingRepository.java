
package com.farmtech.backend.repository;

import com.farmtech.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Explicit query to ensure correct filtering by renter ID
    @Query("SELECT b FROM Booking b WHERE b.renter.id = :renterId")
    List<Booking> findByRenterId(@Param("renterId") Long renterId); // Bookings made by a renter (buyer view)
    
    // Explicit query to ensure correct filtering by owner ID
    @Query("SELECT b FROM Booking b WHERE b.owner.id = :ownerId")
    List<Booking> findByOwnerId(@Param("ownerId") Long ownerId);   // Bookings received for an owner's equipment (owner view)
    
    List<Booking> findByStatus(String status);   // Find bookings by status (for pending bookings)
    List<Booking> findByStatusIn(List<String> statuses); // Find bookings whose status is in the provided list
    
    // New methods for enhanced functionality
    @Query("SELECT b FROM Booking b WHERE b.acceptedOwner.id = :acceptedOwnerId")
    List<Booking> findByAcceptedOwnerId(@Param("acceptedOwnerId") Long acceptedOwnerId); // Bookings accepted by a specific owner
    
    // Explicit query to ensure correct filtering by renter ID and status
    @Query("SELECT b FROM Booking b WHERE b.renter.id = :renterId AND b.status = :status")
    List<Booking> findByRenterIdAndStatus(@Param("renterId") Long renterId, @Param("status") String status);

    // Clean up all bookings referencing an equipment (to avoid FK constraint on delete)
    void deleteByEquipmentId(Long equipmentId);
}