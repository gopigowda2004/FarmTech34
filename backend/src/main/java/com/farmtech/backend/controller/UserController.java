package com.farmtech.backend.controller;

import com.farmtech.backend.entity.User;
import com.farmtech.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // React frontend
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    // Removed check-aadhar endpoint as Aadhar is no longer used

    @GetMapping("/check-email/{email}")
    public boolean checkEmail(@PathVariable String email) {
        return userService.existsByEmail(email);
    }

    @GetMapping("/find-by-phone/{phone}")
    public ResponseEntity<?> findByPhone(@PathVariable String phone) {
        Optional<User> user = userService.findByPhone(phone);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(404).body("User not found with phone: " + phone);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(404).body("User not found with id: " + id);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            Optional<User> user = userService.findById(id);
            if (user.isEmpty()) {
                return ResponseEntity.status(404).body("User not found with id: " + id);
            }
            
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting user: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        try {
            Optional<User> existingUser = userService.findById(id);
            if (existingUser.isEmpty()) {
                return ResponseEntity.status(404).body("User not found with id: " + id);
            }
            
            User user = existingUser.get();
            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());
            user.setPhone(updatedUser.getPhone());
            user.setRole(updatedUser.getRole());
            user.setAddress(updatedUser.getAddress());
            user.setDistrict(updatedUser.getDistrict());
            user.setState(updatedUser.getState());
            user.setPincode(updatedUser.getPincode());
            user.setFarmSize(updatedUser.getFarmSize());
            user.setCropType(updatedUser.getCropType());
            user.setExperience(updatedUser.getExperience());
            user.setEquipmentOwned(updatedUser.getEquipmentOwned());
            
            User saved = userService.saveUser(user);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating user: " + e.getMessage());
        }
    }
}