package com.example.expense_tracker.controller;

import com.example.expense_tracker.dto.AuthRequest;
import com.example.expense_tracker.dto.AuthResponse;
import com.example.expense_tracker.dto.RegisterRequest;
import com.example.expense_tracker.entity.User;
import com.example.expense_tracker.repository.UserRepository;
import com.example.expense_tracker.security.JwtUtil;
import com.example.expense_tracker.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryService categoryService;

    public AuthController(AuthenticationManager authenticationManager, UserDetailsService userDetailsService, 
                          JwtUtil jwtUtil, UserRepository userRepository, PasswordEncoder passwordEncoder,
                          CategoryService categoryService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.categoryService = categoryService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        String identifier = authRequest.getUsername();
        if (identifier == null || identifier.isBlank()) {
            identifier = authRequest.getEmail();
        }

        if (identifier == null || authRequest.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username/email and password are required"));
        }

        final String loginId = identifier.trim();
        User user = userRepository.findByUsername(loginId)
                .or(() -> userRepository.findByEmail(loginId))
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), authRequest.getPassword())
        );
        
        final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        
        return ResponseEntity.ok(new AuthResponse(jwt, user.getUsername(), user.getEmail()));
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        String username = request.getUsername();
        String email = request.getEmail();
        String password = request.getPassword();

        if (username == null || username.isBlank() || email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username, email, and password are required"));
        }

        username = username.trim();
        email = email.trim();

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }
        
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        User savedUser = userRepository.save(user);

        // Seed default categories for newly registered user
        categoryService.createDefaultCategories(savedUser);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("username", savedUser.getUsername());
        response.put("email", savedUser.getEmail());
        return ResponseEntity.ok(response);
    }
}
