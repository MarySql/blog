package com.marysql.blog.model.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostDTO {
    private String id;
    private String title;
    private String content;
    private String authorId;
    private String authorUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

