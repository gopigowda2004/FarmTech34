package com.farmtech.backend.controller;

import com.farmtech.backend.entity.Booking;
import com.farmtech.backend.entity.Equipment;
import com.farmtech.backend.entity.Farmer;
import com.farmtech.backend.repository.BookingRepository;
import com.farmtech.backend.repository.EquipmentRepository;
import com.farmtech.backend.repository.FarmerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private EquipmentRepository equipmentRepo;

    @Autowired
    private FarmerRepository farmerRepo;

    @Autowired
    private com.farmtech.backend.service.SmsService smsService;

    // Create a booking: renter books an equipment (owner inferred from equipment)
    @PostMapping("/create")
    public Booking createBooking(@RequestParam Long equipmentId,
                                 @RequestParam Long renterId,
                                 @RequestParam String startDate,
                                 @RequestParam(required = false) String endDate,
                                 @RequestParam(required = false) Integer hours,
                                 @RequestParam(required = false) String location) {
        Equipment equipment = equipmentRepo.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
        Farmer renter = farmerRepo.findById(renterId)
                .orElseThrow(() -> new RuntimeException("Renter not found"));

        Booking booking = new Booking();
        booking.setEquipment(equipment);
        booking.setOwner(equipment.getOwner());
        booking.setRenter(renter);
        booking.setStartDate(java.time.LocalDate.parse(startDate));
        if (hours != null && hours > 0) {
            booking.setHours(hours);
            // Derive endDate at day granularity to keep compatibility
            int days = Math.max(1, (int) Math.ceil(hours / 24.0));
            java.time.LocalDate end = java.time.LocalDate.parse(startDate).plusDays(days);
            booking.setEndDate(end);
        } else if (endDate != null && !endDate.isEmpty()) {
            booking.setEndDate(java.time.LocalDate.parse(endDate));
        }
        booking.setStatus("PENDING");
        if (location != null && !location.trim().isEmpty()) {
            booking.setLocation(location.trim());
        }
        Booking saved = bookingRepo.save(booking);

        // Send SMS notifications (owner and renter)
        try {
            String eqName = equipment.getName();
            String ownerPhone = equipment.getOwner() != null ? equipment.getOwner().getPhone() : null;
            String renterPhone = renter.getPhone();
            String ownerMsg = String.format(
                    "Your equipment %s has been booked by %s. Start %s, Hours %s. Booking ID %s.",
                    eqName, renter.getName(), startDate, (hours != null ? hours : "-"), saved.getId()
            );
            String renterMsg = String.format(
                    "You booked %s from %s. Start %s, Hours %s. Booking ID %s.",
                    eqName, equipment.getOwner() != null ? equipment.getOwner().getName() : "owner", startDate, (hours != null ? hours : "-"), saved.getId()
            );
            if (ownerPhone != null && !ownerPhone.isBlank()) smsService.sendSms(ownerPhone, ownerMsg);
            if (renterPhone != null && !renterPhone.isBlank()) smsService.sendSms(renterPhone, renterMsg);
        } catch (Exception ignore) {}

        return saved;
    }

    // Bookings the renter has made (buyer account view)
    @GetMapping("/renter/{renterId}")
    public List<Booking> getRenterBookings(@PathVariable Long renterId) {
        return bookingRepo.findByRenterId(renterId);
    }

    // Bookings the owner has received (owner account view)
    @GetMapping("/owner/{ownerId}")
    public List<Booking> getOwnerBookings(@PathVariable Long ownerId) {
        return bookingRepo.findByOwnerId(ownerId);
    }

    // Optional: update status (owner can confirm/cancel)
    @PatchMapping("/{bookingId}/status")
    public Booking updateStatus(@PathVariable Long bookingId, @RequestParam String status) {
        Booking b = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        b.setStatus(status);
        return bookingRepo.save(b);
    }
}