package com.marysql.blog.repositories;

import com.marysql.blog.entities.BlogUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<BlogUser, UUID> {
    Optional<BlogUser> findByEmail(String email);
}