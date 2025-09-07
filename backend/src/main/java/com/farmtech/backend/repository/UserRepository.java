package com.farmtech.backend.repository;

import com.farmtech.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByAadhar(String aadhar);
    boolean existsByEmail(String email);

    User findByPhone(String phone);
    User findByEmail(String email);   // 👈 added
}
