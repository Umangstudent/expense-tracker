package com.example.expense_tracker.repository;

import com.example.expense_tracker.dto.MonthlySummary;
import com.example.expense_tracker.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUserId(Long userId);
    
    List<Income> findByUserIdOrderByDateDesc(Long userId);

    Optional<Income> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.user.id = :userId")
    BigDecimal sumAmountByUserId(@Param("userId") Long userId);

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.user.id = :userId")
    BigDecimal sumTotalByUserId(@Param("userId") Long userId);

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.user.id = :userId")
    BigDecimal sumByUserId(@Param("userId") Long userId);

    @Query("SELECT YEAR(i.date) as year, MONTH(i.date) as month, SUM(i.amount) as total FROM Income i WHERE i.user.id = :userId GROUP BY YEAR(i.date), MONTH(i.date) ORDER BY YEAR(i.date), MONTH(i.date)")
    List<MonthlySummary> getMonthlyIncomeSummary(@Param("userId") Long userId);

    @Query("SELECT YEAR(i.date) as year, MONTH(i.date) as month, SUM(i.amount) as total FROM Income i WHERE i.user.id = :userId GROUP BY YEAR(i.date), MONTH(i.date) ORDER BY YEAR(i.date), MONTH(i.date)")
    List<MonthlySummary> getMonthlySummary(@Param("userId") Long userId);
}
