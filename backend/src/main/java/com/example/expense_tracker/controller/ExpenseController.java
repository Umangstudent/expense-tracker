package com.example.expense_tracker.controller;

import com.example.expense_tracker.entity.Expense;
import com.example.expense_tracker.entity.User;
import com.example.expense_tracker.security.SecurityUtils;
import com.example.expense_tracker.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    
    private final ExpenseService expenseService;
    private final SecurityUtils securityUtils;

    public ExpenseController(ExpenseService expenseService, SecurityUtils securityUtils) {
        this.expenseService = expenseService;
        this.securityUtils = securityUtils;
    }
    
    @GetMapping
    public List<Expense> getExpenses() {
        User user = securityUtils.getCurrentUser();
        return expenseService.getExpensesForUser(user);
    }

    @GetMapping("/user/{userId}")
    public List<Expense> getExpensesByUserId(@PathVariable Long userId) {
        User user = securityUtils.getCurrentUser();
        return expenseService.getExpensesForUser(user);
    }
    
    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        User user = securityUtils.getCurrentUser();
        Expense created = expenseService.createExpense(expense, user);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        User user = securityUtils.getCurrentUser();
        Expense updated = expenseService.updateExpense(id, expense, user);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        User user = securityUtils.getCurrentUser();
        expenseService.deleteExpense(id, user);
        return ResponseEntity.ok().build();
    }
}
