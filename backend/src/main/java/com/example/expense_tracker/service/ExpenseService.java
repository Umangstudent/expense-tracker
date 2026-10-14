package com.example.expense_tracker.service;

import com.example.expense_tracker.entity.Category;
import com.example.expense_tracker.entity.Expense;
import com.example.expense_tracker.entity.User;
import com.example.expense_tracker.exception.ResourceNotFoundException;
import com.example.expense_tracker.repository.CategoryRepository;
import com.example.expense_tracker.repository.ExpenseRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {
    
    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;

    public ExpenseService(ExpenseRepository expenseRepository, CategoryRepository categoryRepository) {
        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Expense> getExpensesForUser(User user) {
        return expenseRepository.findByUserIdOrderByDateDesc(user.getId());
    }

    public List<Expense> getExpensesByUserId(Long userId) {
        return expenseRepository.findByUserIdOrderByDateDesc(userId);
    }

    public Expense getExpenseById(Long id, User user) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        if (expense.getUser() == null || !expense.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to access this expense");
        }
        return expense;
    }

    public Expense createExpense(Expense expense, User user) {
        expense.setUser(user);
        if (expense.getDate() == null) {
            expense.setDate(LocalDate.now());
        }
        resolveCategory(expense, user);
        return expenseRepository.save(expense);
    }

    public Expense updateExpense(Long id, Expense expenseDetails, User user) {
        Expense expense = getExpenseById(id, user);
        if (expenseDetails.getDescription() != null) {
            expense.setDescription(expenseDetails.getDescription());
        }
        if (expenseDetails.getAmount() != null) {
            expense.setAmount(expenseDetails.getAmount());
        }
        if (expenseDetails.getDate() != null) {
            expense.setDate(expenseDetails.getDate());
        }
        if (expenseDetails.getCategory() != null || expenseDetails.getCategoryId() != null) {
            resolveCategory(expenseDetails, user);
            expense.setCategory(expenseDetails.getCategory());
        }
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id, User user) {
        Expense expense = getExpenseById(id, user);
        expenseRepository.delete(expense);
    }

    public void deleteExpense(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        expenseRepository.delete(expense);
    }

    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    private void resolveCategory(Expense expense, User user) {
        Category category = null;
        if (expense.getCategory() != null && expense.getCategory().getId() != null) {
            category = categoryRepository.findById(expense.getCategory().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + expense.getCategory().getId()));
        } else if (expense.getCategoryId() != null) {
            category = categoryRepository.findById(expense.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + expense.getCategoryId()));
        } else if (expense.getCategory() != null && expense.getCategory().getName() != null) {
            category = categoryRepository.findByUserIdAndName(user.getId(), expense.getCategory().getName())
                    .orElseGet(() -> {
                        Category newCat = new Category();
                        newCat.setName(expense.getCategory().getName());
                        newCat.setUser(user);
                        return categoryRepository.save(newCat);
                    });
        }
        
        if (category != null) {
            if (category.getUser() != null && !category.getUser().getId().equals(user.getId())) {
                throw new AccessDeniedException("You do not have permission to use this category");
            }
            expense.setCategory(category);
        } else {
            throw new IllegalArgumentException("A valid category must be provided for the expense");
        }
    }
}
