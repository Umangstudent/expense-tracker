package com.example.expense_tracker.service;

import com.example.expense_tracker.entity.Category;
import com.example.expense_tracker.entity.User;
import com.example.expense_tracker.exception.ResourceNotFoundException;
import com.example.expense_tracker.repository.CategoryRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CategoryService {
    
    public static final Map<String, String> DEFAULT_CATEGORIES = Map.of(
            "Food", "#ef4444",
            "Transport", "#3b82f6",
            "Utilities", "#f59e0b",
            "Entertainment", "#8b5cf6",
            "Shopping", "#ec4899",
            "Health", "#10b981",
            "Education", "#06b6d4",
            "Other", "#64748b"
    );

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getCategoriesForUser(User user) {
        return categoryRepository.findByUserId(user.getId());
    }

    public List<Category> getCategoriesByUserId(Long userId) {
        return categoryRepository.findByUserId(userId);
    }

    public Category getCategoryById(Long id, User user) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        if (category.getUser() == null || !category.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to access this category");
        }
        return category;
    }

    public Category createCategory(Category category, User user) {
        category.setUser(user);
        if (category.getColor() == null || category.getColor().isBlank()) {
            category.setColor("#8b5cf6");
        }
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryDetails, User user) {
        Category category = getCategoryById(id, user);
        if (categoryDetails.getName() != null) {
            category.setName(categoryDetails.getName());
        }
        if (categoryDetails.getColor() != null) {
            category.setColor(categoryDetails.getColor());
        }
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id, User user) {
        Category category = getCategoryById(id, user);
        categoryRepository.delete(category);
    }

    public void createDefaultCategories(User user) {
        for (Map.Entry<String, String> entry : DEFAULT_CATEGORIES.entrySet()) {
            if (!categoryRepository.existsByUserIdAndName(user.getId(), entry.getKey())) {
                Category category = new Category();
                category.setName(entry.getKey());
                category.setColor(entry.getValue());
                category.setUser(user);
                categoryRepository.save(category);
            }
        }
    }
}
