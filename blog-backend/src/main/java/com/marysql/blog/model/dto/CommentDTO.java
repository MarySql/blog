package com.marysql.blog.model.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private String content;
    private LocalDateTime createdAt;
}
