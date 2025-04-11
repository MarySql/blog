package com.marysql.blog.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collation = "comments")
@Data
public class Comment {

    @Id
    private String id;
    private String content;
    private String authorId; //Ref ao class User
    private String postId; //Ref a class Post
    private LocalDateTime createdAt;
}
