package com.example.expense_tracker.controller;

import com.example.expense_tracker.entity.Category;
import com.example.expense_tracker.entity.User;
import com.example.expense_tracker.security.SecurityUtils;
import com.example.expense_tracker.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    
    private final CategoryService categoryService;
    private final SecurityUtils securityUtils;

    public CategoryController(CategoryService categoryService, SecurityUtils securityUtils) {
        this.categoryService = categoryService;
        this.securityUtils = securityUtils;
    }
    
    @GetMapping
    public List<Category> getCategories() {
        User user = securityUtils.getCurrentUser();
        return categoryService.getCategoriesForUser(user);
    }

    @GetMapping("/user/{userId}")
    public List<Category> getCategoriesByUserId(@PathVariable Long userId) {
        User user = securityUtils.getCurrentUser();
        return categoryService.getCategoriesForUser(user);
    }
    
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        User user = securityUtils.getCurrentUser();
        Category created = categoryService.createCategory(category, user);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        User user = securityUtils.getCurrentUser();
        Category updated = categoryService.updateCategory(id, category, user);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        User user = securityUtils.getCurrentUser();
        categoryService.deleteCategory(id, user);
        return ResponseEntity.ok().build();
    }
}
