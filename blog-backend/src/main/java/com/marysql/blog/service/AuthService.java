package com.marysql.blog.service;

import com.marysql.blog.model.dto.UserDTO;
import com.marysql.blog.model.entity.User;
import com.marysql.blog.repository.UserRepository;
import com.marysql.blog.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public String register(UserDTO userDTO) {
        logger.info("Registrando usuário: {}", userDTO.getUsername());
        if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
            logger.warn("Username já existe: {}", userDTO.getUsername());
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            logger.warn("Email já existe: {}", userDTO.getEmail());
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        User user = new User();
        user.setRoles(List.of("ROLE_USER"));
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        userRepository.save(user);
        logger.info("Usuário registrado com sucesso: {}", userDTO.getUsername());

        return "Usuário registrado com sucesso!";
    }

    public String login(UserDTO userDTO) {
        logger.info("Tentando login para usuário: {}", userDTO.getUsername());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userDTO.getUsername(), userDTO.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtUtil.generateToken(authentication.getName());
            logger.info("Login bem-sucedido, token gerado para: {}", userDTO.getUsername());
            return token;
        } catch (BadCredentialsException e) {
            logger.error("Credenciais inválidas para usuário: {}", userDTO.getUsername());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }
    }
}