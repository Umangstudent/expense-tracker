package com.example.expense_tracker.service;

import com.example.expense_tracker.dto.CategoryBreakdown;
import com.example.expense_tracker.dto.MonthlySummary;
import com.example.expense_tracker.entity.User;
import com.example.expense_tracker.repository.ExpenseRepository;
import com.example.expense_tracker.repository.IncomeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class DashboardService {
    
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

    public DashboardService(ExpenseRepository expenseRepository, IncomeRepository incomeRepository) {
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
    }

    public Map<String, Object> getDashboardSummary(User user) {
        return getDashboardSummary(user.getId());
    }

    public Map<String, Object> getDashboardSummary(Long userId) {
        BigDecimal totalExpenses = expenseRepository.sumAmountByUserId(userId);
        if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;
        
        BigDecimal totalIncome = incomeRepository.sumAmountByUserId(userId);
        if (totalIncome == null) totalIncome = BigDecimal.ZERO;
        
        BigDecimal balance = totalIncome.subtract(totalExpenses);

        List<Map<String, Object>> categoryBreakdown = new ArrayList<>();
        List<CategoryBreakdown> cbList = expenseRepository.getCategoryBreakdown(userId);
        if (cbList != null) {
            for (CategoryBreakdown cb : cbList) {
                Map<String, Object> item = new HashMap<>();
                item.put("category", cb.getCategory());
                item.put("total", cb.getTotal());
                categoryBreakdown.add(item);
            }
        }

        List<Map<String, Object>> monthlyExpenses = new ArrayList<>();
        List<MonthlySummary> meList = expenseRepository.getMonthlyExpenseSummary(userId);
        if (meList != null) {
            for (MonthlySummary ms : meList) {
                Map<String, Object> item = new HashMap<>();
                item.put("year", ms.getYear());
                item.put("month", ms.getMonth());
                item.put("total", ms.getTotal());
                monthlyExpenses.add(item);
            }
        }

        List<Map<String, Object>> monthlyIncomes = new ArrayList<>();
        List<MonthlySummary> miList = incomeRepository.getMonthlyIncomeSummary(userId);
        if (miList != null) {
            for (MonthlySummary ms : miList) {
                Map<String, Object> item = new HashMap<>();
                item.put("year", ms.getYear());
                item.put("month", ms.getMonth());
                item.put("total", ms.getTotal());
                monthlyIncomes.add(item);
            }
        }

        // Monthly combined breakdown for chart display
        Map<String, Map<String, Object>> monthMap = new TreeMap<>();
        String[] monthNames = {"", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        
        if (miList != null) {
            for (MonthlySummary ms : miList) {
                String key = String.format("%04d-%02d", ms.getYear(), ms.getMonth());
                Map<String, Object> m = monthMap.computeIfAbsent(key, k -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("year", ms.getYear());
                    map.put("month", ms.getMonth());
                    map.put("name", (ms.getMonth() != null && ms.getMonth() >= 1 && ms.getMonth() <= 12) ? monthNames[ms.getMonth()] : String.valueOf(ms.getMonth()));
                    map.put("income", BigDecimal.ZERO);
                    map.put("expense", BigDecimal.ZERO);
                    return map;
                });
                m.put("income", ms.getTotal());
            }
        }

        if (meList != null) {
            for (MonthlySummary ms : meList) {
                String key = String.format("%04d-%02d", ms.getYear(), ms.getMonth());
                Map<String, Object> m = monthMap.computeIfAbsent(key, k -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("year", ms.getYear());
                    map.put("month", ms.getMonth());
                    map.put("name", (ms.getMonth() != null && ms.getMonth() >= 1 && ms.getMonth() <= 12) ? monthNames[ms.getMonth()] : String.valueOf(ms.getMonth()));
                    map.put("income", BigDecimal.ZERO);
                    map.put("expense", BigDecimal.ZERO);
                    return map;
                });
                m.put("expense", ms.getTotal());
            }
        }

        List<Map<String, Object>> monthlyBreakdown = new ArrayList<>(monthMap.values());

        // Calculate current month's expense and income
        java.time.LocalDate today = java.time.LocalDate.now();
        int curYear = today.getYear();
        int curMonth = today.getMonthValue();

        BigDecimal currentMonthExpense = BigDecimal.ZERO;
        if (meList != null) {
            for (MonthlySummary ms : meList) {
                if (ms.getYear() != null && ms.getYear() == curYear &&
                    ms.getMonth() != null && ms.getMonth() == curMonth) {
                    currentMonthExpense = ms.getTotal();
                    break;
                }
            }
        }
        // If no expenses in the exact current month, fall back to totalExpenses or latest month
        if (currentMonthExpense.compareTo(BigDecimal.ZERO) == 0 && totalExpenses.compareTo(BigDecimal.ZERO) > 0) {
            if (meList != null && !meList.isEmpty()) {
                currentMonthExpense = meList.get(meList.size() - 1).getTotal();
            } else {
                currentMonthExpense = totalExpenses;
            }
        }

        BigDecimal currentMonthIncome = BigDecimal.ZERO;
        if (miList != null) {
            for (MonthlySummary ms : miList) {
                if (ms.getYear() != null && ms.getYear() == curYear &&
                    ms.getMonth() != null && ms.getMonth() == curMonth) {
                    currentMonthIncome = ms.getTotal();
                    break;
                }
            }
        }
        if (currentMonthIncome.compareTo(BigDecimal.ZERO) == 0 && totalIncome.compareTo(BigDecimal.ZERO) > 0) {
            if (miList != null && !miList.isEmpty()) {
                currentMonthIncome = miList.get(miList.size() - 1).getTotal();
            } else {
                currentMonthIncome = totalIncome;
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpenses", totalExpenses);
        summary.put("totalExpense", totalExpenses);
        summary.put("monthlyExpense", currentMonthExpense);
        summary.put("monthlyIncome", currentMonthIncome);
        summary.put("balance", balance);
        summary.put("monthlyBreakdown", monthlyBreakdown);
        summary.put("monthlyExpenses", monthlyExpenses);
        summary.put("monthlyIncomes", monthlyIncomes);
        summary.put("categoryBreakdown", categoryBreakdown);
        summary.put("expensesByCategory", categoryBreakdown);

        return summary;
    }
}
