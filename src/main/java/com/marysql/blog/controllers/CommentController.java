package com.marysql.blog.controllers;

import com.marysql.blog.entities.Comment;
import com.marysql.blog.services.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/comments")
public class CommentController {
    private final CommentService commentService;

    // Injeta o construtor para lidar com logica de negocios
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // Metodo listar todos
    @GetMapping
    public ResponseEntity<List<Comment>> listarTodos() {
        return ResponseEntity.ok(commentService.listarTodos());
    }

    // Metodo listar por id
    @GetMapping("/{id}")
    public ResponseEntity<Comment> buscarPorId(@PathVariable UUID id) {
        Optional<Comment> comment = commentService.buscarPorId(id);
        return comment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // salvar um comentario
    @PostMapping
    public ResponseEntity<Comment> salvar(@Valid @RequestBody Comment comment) {
        Comment savedComment = commentService.salvar(comment);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedComment.getId())
                .toUri();
        return ResponseEntity.created(location).body(savedComment);
    }

    // deletar um comentario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        commentService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
