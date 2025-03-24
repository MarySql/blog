package com.marysql.blog.repositories;

import com.marysql.blog.entities.Post;
import com.marysql.blog.entities.BlogUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {
    List<Post> findByAutor(BlogUser autor);
}
