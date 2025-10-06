package com.farmtech.backend.repository;

import com.farmtech.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);

    Optional<User> findByPhone(String phone);
    Optional<User> findByEmail(String email);
    List<User> findByRole(String role);
}
