// src/main/java/com/shoppc/backendnosecurity/repository/UserRepository.java
package com.shoppc.backendnosecurity.repository;

import com.shoppc.backendnosecurity.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> { // String thay vì Long
    // Không cần existsByEmail vì email đã mã hóa
}
