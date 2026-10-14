package com.example.expense_tracker.repository;

import com.example.expense_tracker.dto.CategoryBreakdown;
import com.example.expense_tracker.dto.MonthlySummary;
import com.example.expense_tracker.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserId(Long userId);
    
    List<Expense> findByUserIdOrderByDateDesc(Long userId);

    Optional<Expense> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId")
    BigDecimal sumAmountByUserId(@Param("userId") Long userId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId")
    BigDecimal sumTotalByUserId(@Param("userId") Long userId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId")
    BigDecimal sumByUserId(@Param("userId") Long userId);

    @Query("SELECT e.category.name as category, SUM(e.amount) as total FROM Expense e WHERE e.user.id = :userId GROUP BY e.category.name")
    List<CategoryBreakdown> getCategoryBreakdown(@Param("userId") Long userId);

    @Query("SELECT YEAR(e.date) as year, MONTH(e.date) as month, SUM(e.amount) as total FROM Expense e WHERE e.user.id = :userId GROUP BY YEAR(e.date), MONTH(e.date) ORDER BY YEAR(e.date), MONTH(e.date)")
    List<MonthlySummary> getMonthlyExpenseSummary(@Param("userId") Long userId);

    @Query("SELECT YEAR(e.date) as year, MONTH(e.date) as month, SUM(e.amount) as total FROM Expense e WHERE e.user.id = :userId GROUP BY YEAR(e.date), MONTH(e.date) ORDER BY YEAR(e.date), MONTH(e.date)")
    List<MonthlySummary> getMonthlySummary(@Param("userId") Long userId);
}
