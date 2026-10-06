package com.example.expense_tracker.repository;

import com.example.expense_tracker.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserId(Long userId);

    @Query("SELECT e.category.name as category, SUM(e.amount) as total FROM Expense e WHERE e.user.id = :userId GROUP BY e.category.name")
    List<Map<String, Object>> getCategoryBreakdown(@Param("userId") Long userId);

    @Query("SELECT YEAR(e.date) as year, MONTH(e.date) as month, SUM(e.amount) as total FROM Expense e WHERE e.user.id = :userId GROUP BY YEAR(e.date), MONTH(e.date) ORDER BY year, month")
    List<Map<String, Object>> getMonthlySummary(@Param("userId") Long userId);
}
