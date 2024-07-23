package com.saessakmaeul.bitamin.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<String> authenticateUser(@RequestParam String email, @RequestParam String password) {
        String tokenDTO = authService.authenticateUser(email, password);
        return ResponseEntity.ok(tokenDTO);
    }
}
