package com.marysql.blog.services;

import com.marysql.blog.entities.BlogUser;
import com.marysql.blog.entities.Comment;
import com.marysql.blog.entities.Post;
import com.marysql.blog.repositories.CommentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CommentService {
    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public List<Comment> listarTodos() {
        return commentRepository.findAll();
    }

    public Optional<Comment> buscarPorId(UUID id) {
        return commentRepository.findById(id);
    }

    public List<Comment> buscarPorPost(Post post) {
        return commentRepository.findByPost(post);
    }

    public List<Comment> buscarPorAutor(BlogUser autor) {
        return commentRepository.findByAutor(autor);
    }

    public Comment salvar(Comment comentario) {
        return commentRepository.save(comentario);
    }

    public void deletar(UUID id) {
        commentRepository.deleteById(id);
    }
}
