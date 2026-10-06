package com.example.expense_tracker.controller;

import com.example.expense_tracker.repository.ExpenseRepository;
import com.example.expense_tracker.repository.IncomeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

    public DashboardController(ExpenseRepository expenseRepository, IncomeRepository incomeRepository) {
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
    }
    
    @GetMapping("/{userId}/summary")
    public Map<String, Object> getDashboardSummary(@PathVariable Long userId) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("expensesByCategory", expenseRepository.getCategoryBreakdown(userId));
        summary.put("monthlyExpenses", expenseRepository.getMonthlySummary(userId));
        summary.put("monthlyIncomes", incomeRepository.getMonthlySummary(userId));
        return summary;
    }
}
