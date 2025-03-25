package com.marysql.blog.services;

import com.marysql.blog.entities.BlogUser;
import com.marysql.blog.entities.Post;
import com.marysql.blog.entities.BlogUser;
import com.marysql.blog.repositories.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PostService {
    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> listarTodos() {
        return postRepository.findAll();
    }

    public Optional<Post> buscarPorId(UUID id) {
        return postRepository.findById(id);
    }

    public List<Post> buscarPorAutor(BlogUser autor) {
        return postRepository.findByAutor(autor);
    }

    public Post salvar(Post post) {
        return postRepository.save(post);
    }

    public void deletar(UUID id) {
        postRepository.deleteById(id);
    }
}
