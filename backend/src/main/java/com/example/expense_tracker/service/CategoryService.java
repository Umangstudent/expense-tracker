package com.example.expense_tracker.service;

import com.example.expense_tracker.entity.Category;
import com.example.expense_tracker.entity.User;
import com.example.expense_tracker.exception.ResourceNotFoundException;
import com.example.expense_tracker.repository.CategoryRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    
    public static final List<String> DEFAULT_CATEGORIES = List.of(
            "Food", "Transport", "Utilities", "Entertainment", "Shopping", "Health", "Education", "Other"
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
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryDetails, User user) {
        Category category = getCategoryById(id, user);
        if (categoryDetails.getName() != null) {
            category.setName(categoryDetails.getName());
        }
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id, User user) {
        Category category = getCategoryById(id, user);
        categoryRepository.delete(category);
    }

    public void createDefaultCategories(User user) {
        for (String name : DEFAULT_CATEGORIES) {
            if (!categoryRepository.existsByUserIdAndName(user.getId(), name)) {
                Category category = new Category();
                category.setName(name);
                category.setUser(user);
                categoryRepository.save(category);
            }
        }
    }
}
