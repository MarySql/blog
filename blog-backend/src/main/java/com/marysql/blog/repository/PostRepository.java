package com.marysql.blog.repository;

import com.marysql.blog.model.entity.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository extends MongoRepository<Post, String> {
}
