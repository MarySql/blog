package com.marysql.blog.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password; // Hash da senha (usar BCrypt) <-
    private List<String> roles; // "ROLE_USER", "ROLE_ADMIN"
}
