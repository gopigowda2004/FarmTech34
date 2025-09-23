package com.farmtech.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "equipment_id")
    private Equipment equipment; // The equipment being booked

    @ManyToOne(optional = false)
    @JoinColumn(name = "owner_id")
    private Farmer owner; // Owner of equipment (redundant but simplifies queries/UI)

    @ManyToOne(optional = false)
    @JoinColumn(name = "renter_id")
    private Farmer renter; // Farmer who is booking (buyer)

    private LocalDate startDate;
    private LocalDate endDate;

    // Store duration in hours for accuracy when renter books by hours
    private Integer hours;

    private String status; // PENDING, CONFIRMED, CANCELLED

    private String location; // Address where equipment is needed

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Equipment getEquipment() { return equipment; }
    public void setEquipment(Equipment equipment) { this.equipment = equipment; }

    public Farmer getOwner() { return owner; }
    public void setOwner(Farmer owner) { this.owner = owner; }

    public Farmer getRenter() { return renter; }
    public void setRenter(Farmer renter) { this.renter = renter; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Integer getHours() { return hours; }
    public void setHours(Integer hours) { this.hours = hours; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}