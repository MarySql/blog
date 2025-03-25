package com.marysql.blog.repositories;

import com.marysql.blog.entities.Comment;
import com.marysql.blog.entities.Post;
import com.marysql.blog.entities.BlogUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findByPost(Post post);
    List<Comment> findByAutor(BlogUser autor);
}
