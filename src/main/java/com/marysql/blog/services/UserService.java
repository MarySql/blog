package com.marysql.blog.services;

import com.marysql.blog.entities.BlogUser;
import com.marysql.blog.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<BlogUser> listarTodos() {
        return userRepository.findAll();
    }

    public Optional<BlogUser> buscarPorId(UUID id) {
        return userRepository.findById(id);
    }

    public Optional<BlogUser> buscarPorEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public BlogUser salvar(BlogUser blogUser) {
        return userRepository.save(blogUser);
    }

    public void deletar(UUID id) {
        userRepository.deleteById(id);
    }
}
