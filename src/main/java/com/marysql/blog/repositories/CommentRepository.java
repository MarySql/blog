package com.marysql.blog.repositories;

import com.marysql.blog.entities.Comments;
import com.marysql.blog.entities.Post;
import com.marysql.blog.entities.BlogUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comments, UUID> {
    List<Comments> findByPost(Post post);
    List<Comments> findByAutor(BlogUser autor);
}
