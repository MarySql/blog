package com.marysql.blog.service;

import com.marysql.blog.model.dto.PostDTO;
import com.marysql.blog.model.entity.Post;
import com.marysql.blog.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public PostDTO createPost(PostDTO postDTO, String authorId) {
        Post post = new Post();
        post.setTitle(postDTO.getTitle());
        post.setContent(postDTO.getContent());
        post.setAuthorId(authorId);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        post = postRepository.save(post);
        return mapToDTO(post);
    }

}
