package com.marysql.blog.services;

import com.marysql.blog.entities.BlogUser;
import com.marysql.blog.entities.Comments;
import com.marysql.blog.entities.Post;
import com.marysql.blog.entities.BlogUser;
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

    public List<Comments> listarTodos() {
        return commentRepository.findAll();
    }

    public Optional<Comments> buscarPorId(UUID id) {
        return commentRepository.findById(id);
    }

    public List<Comments> buscarPorPost(Post post) {
        return commentRepository.findByPost(post);
    }

    public List<Comments> buscarPorAutor(BlogUser autor) {
        return commentRepository.findByAutor(autor);
    }

    public Comments salvar(Comments comentario) {
        return commentRepository.save(comentario);
    }

    public void deletar(UUID id) {
        commentRepository.deleteById(id);
    }
}
