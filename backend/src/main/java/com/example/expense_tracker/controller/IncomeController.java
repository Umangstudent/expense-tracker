package com.example.expense_tracker.controller;

import com.example.expense_tracker.entity.Income;
import com.example.expense_tracker.entity.User;
import com.example.expense_tracker.security.SecurityUtils;
import com.example.expense_tracker.service.IncomeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
public class IncomeController {
    
    private final IncomeService incomeService;
    private final SecurityUtils securityUtils;

    public IncomeController(IncomeService incomeService, SecurityUtils securityUtils) {
        this.incomeService = incomeService;
        this.securityUtils = securityUtils;
    }
    
    @GetMapping
    public List<Income> getIncomes() {
        User user = securityUtils.getCurrentUser();
        return incomeService.getIncomesForUser(user);
    }

    @GetMapping("/user/{userId}")
    public List<Income> getIncomesByUserId(@PathVariable Long userId) {
        User user = securityUtils.getCurrentUser();
        return incomeService.getIncomesForUser(user);
    }
    
    @PostMapping
    public ResponseEntity<Income> createIncome(@RequestBody Income income) {
        User user = securityUtils.getCurrentUser();
        Income created = incomeService.createIncome(income, user);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Income> updateIncome(@PathVariable Long id, @RequestBody Income income) {
        User user = securityUtils.getCurrentUser();
        Income updated = incomeService.updateIncome(id, income, user);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIncome(@PathVariable Long id) {
        User user = securityUtils.getCurrentUser();
        incomeService.deleteIncome(id, user);
        return ResponseEntity.ok().build();
    }
}
