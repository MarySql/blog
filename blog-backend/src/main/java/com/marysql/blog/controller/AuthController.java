// Como a autenticação é stateless (JWT), o logout é gerenciado no frontend, invalidando o token ex: removendo do localStorage
package com.marysql.blog.controller;

import com.marysql.blog.model.dto.UserDTO;
import com.marysql.blog.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    private ResponseEntity<String> rigister(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(authService.register(userDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(authService.login(userDTO));
    }
}

