package com.example.expense_tracker.service;

import com.example.expense_tracker.repository.ExpenseRepository;
import com.example.expense_tracker.repository.IncomeRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {
    
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

    public DashboardService(ExpenseRepository expenseRepository, IncomeRepository incomeRepository) {
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
    }

    public Map<String, Object> getDashboardSummary(Long userId) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("expensesByCategory", expenseRepository.getCategoryBreakdown(userId));
        summary.put("monthlyExpenses", expenseRepository.getMonthlySummary(userId));
        summary.put("monthlyIncomes", incomeRepository.getMonthlySummary(userId));
        return summary;
    }
}
