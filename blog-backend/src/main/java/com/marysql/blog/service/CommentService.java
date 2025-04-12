package com.marysql.blog.service;

import com.marysql.blog.model.dto.CommentDTO;
import com.marysql.blog.model.entity.Comment;
import com.marysql.blog.model.entity.Post;
import com.marysql.blog.repository.CommentRepository;
import com.marysql.blog.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    public CommentDTO createComment(String postId, CommentDTO commentDTO, String authorId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();
        comment.setContent(commentDTO.getContent());
        comment.setAuthorId(authorId);
        comment.setPostId(postId);
        comment.setCreatedAt(LocalDateTime.now());
        comment = commentRepository.save(comment);

        // Atualizar lista de comentários no post
        post.getCommentIds().add(comment.getId());
        postRepository.save(post);

        return mapToDTO(comment);
    }

    public List<CommentDTO> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private CommentDTO mapToDTO(Comment comment) {
        CommentDTO commentDTO = new CommentDTO();
        commentDTO.setContent(comment.getContent());
        commentDTO.setCreatedAt(comment.getCreatedAt());
        return commentDTO;
    }

}
