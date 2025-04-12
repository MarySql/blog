package com.marysql.blog.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserDTO {
@NotBlank(message = "Nome do usuário obrigatório")
@Size(min = 3, max = 20, message = "O nome precisa ter entre 3 e 20 caracteres")
    private String username;

@NotBlank(message = "Email obrigatório")
@Email(message = "Email precisa ser válido")
    private String email;

@NotBlank(message = "Senha obrigatória")
@Size(min = 6, message = "A senha precisa ter no mínimo 6 caracteres")
    private String password;
}
