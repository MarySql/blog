package com.marysql.blog.controller;

import com.marysql.blog.model.dto.PostDTO;
import com.marysql.blog.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
    public ResponseEntity<PostDTO> createPost(@RequestBody PostDTO postDTO, Authentication authentication) {
        String authorId = getUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(postService.createPost(postDTO, authorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPost(@PathVariable String id) {
        return ResponseEntity.ok(postService.getPost(id));
    }

    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> updatePost(@PathVariable String id, @RequestBody PostDTO postDTO, Authentication authentication) {
        String authorId = getUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(postService.updatePost(id, postDTO, authorId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id, Authentication authentication) {
        String authorId = getUserIdFromAuthentication(authentication);
        postService.deletePost(id, authorId);
        return ResponseEntity.noContent().build();
    }

    private String getUserIdFromAuthentication(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuário não autenticado");
        }
        return authentication.getName(); // Retorna o username do usuário autenticado
    }
}
