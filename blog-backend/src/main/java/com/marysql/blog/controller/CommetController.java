package com.marysql.blog.controller;


import com.marysql.blog.model.dto.CommentDTO;
import com.marysql.blog.service.CommentService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/posts/{postId}/comments")
public class CommetController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentDTO> createComment(@PathVariable String postId, @RequestBody CommentDTO commentDTO, Authentication authentication) {
        String authorId = getUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(commentService.createComment(postId, commentDTO, authorId));
    }

    @GetMapping
    public ResponseEntity<List<CommentDTO>> getComments(@PathVariable String postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }

    private String getUserIdFromAuthentication(Authentication authentication) {
        // Implementar lógica para obter o ID do usuário autenticado
        return "user-id-placeholder"; // Substituir com lógica real
    }
}