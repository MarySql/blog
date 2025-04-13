package com.marysql.blog.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "posts")
@Data
public class Post {
    @Id
    private String id;
    private String title;
    private String content; // Markdown
    private String authorId; // Referência a classe User
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> commentIds; // IDs dos comentários
}
