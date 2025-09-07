package com.farmtech.backend.controller;

import com.farmtech.backend.entity.User;
import com.farmtech.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/check-aadhar/{aadhar}")
    public boolean checkAadhar(@PathVariable String aadhar) {
        return userService.existsByAadhar(aadhar);
    }

    @GetMapping("/check-email/{email}")
    public boolean checkEmail(@PathVariable String email) {
        return userService.existsByEmail(email);
    }

    @GetMapping("/find-by-phone/{phone}")
    public User findByPhone(@PathVariable String phone) {
        return userService.findByPhone(phone);
    }
}